from flask import Blueprint, request, jsonify
from models.db import db
from models.models import ChatLog

chatbot_bp = Blueprint('chatbot', __name__)

# ─── Intent → Response mapping ───────────────────────────
RESPONSES = {
    'wifi': {
        'keywords': ['wifi', 'wireless', 'internet', 'network', 'disconnect', 'connection'],
        'reply': (
            "Here's how to fix WiFi issues:\n\n"
            "1. Restart your router/modem (unplug for 30 seconds)\n"
            "2. Forget the WiFi network and reconnect\n"
            "3. Run Windows Network Troubleshooter\n"
            "4. Update network adapter drivers\n"
            "5. Try ipconfig /flushdns in Command Prompt\n\n"
            "If still not resolved, raise a ticket for IT support."
        )
    },
    'slow': {
        'keywords': ['slow', 'freeze', 'hang', 'performance', 'lag', 'unresponsive', 'boot'],
        'reply': (
            "To fix slow system performance:\n\n"
            "1. Open Task Manager (Ctrl+Shift+Esc)\n"
            "2. End high CPU/RAM processes\n"
            "3. Restart your computer\n"
            "4. Run Disk Cleanup (Start → Disk Cleanup)\n"
            "5. Check for malware (Windows Defender scan)\n"
            "6. Disable startup programs\n\n"
            "If still slow, we may need to check for hardware issues."
        )
    },
    'password': {
        'keywords': ['password', 'forgot', 'reset', 'locked', 'login', 'credentials', 'account'],
        'reply': (
            "Password reset steps:\n\n"
            "1. Visit the company portal\n"
            "2. Click 'Forgot Password'\n"
            "3. Enter your employee ID / email\n"
            "4. Check your registered mobile for OTP\n"
            "5. Set a new password (min 8 chars, 1 uppercase, 1 number)\n\n"
            "Or call IT Helpdesk at Ext. 1234 for immediate assistance."
        )
    },
    'email': {
        'keywords': ['email', 'outlook', 'mail', 'inbox', 'sync', 'authentication', 'exchange'],
        'reply': (
            "Email troubleshooting steps:\n\n"
            "1. Close and reopen Outlook\n"
            "2. Go to File → Account Settings → Repair Account\n"
            "3. Check internet connection\n"
            "4. Clear Outlook cache (File → Options → Advanced → Empty AutoComplete)\n"
            "5. Try Outlook Web (webmail.company.com)\n\n"
            "If still not working, raise a ticket with your employee ID."
        )
    },
    'printer': {
        'keywords': ['printer', 'print', 'printing', 'offline', 'paper', 'ink', 'scanner'],
        'reply': (
            "Printer troubleshooting:\n\n"
            "1. Check printer is powered on and connected\n"
            "2. Cancel all pending print jobs\n"
            "3. Remove and re-add the printer in Settings\n"
            "4. Restart Print Spooler: Services → Print Spooler → Restart\n"
            "5. Check paper and ink/toner levels\n\n"
            "For network printers, check if you're on the correct network."
        )
    },
    'vpn': {
        'keywords': ['vpn', 'remote', 'access', 'tunnel', 'connect vpn', 'cisco', 'anyconnect'],
        'reply': (
            "VPN connection guide:\n\n"
            "1. Ensure VPN client is installed (Cisco AnyConnect)\n"
            "2. Use your employee credentials\n"
            "3. Check if your firewall is blocking VPN\n"
            "4. Try a different VPN server location\n"
            "5. Restart the VPN client\n\n"
            "For VPN password reset, contact IT at Ext. 1234."
        )
    },
}

def detect_intent(message: str) -> str:
    msg_lower = message.lower()
    for intent, data in RESPONSES.items():
        if any(kw in msg_lower for kw in data['keywords']):
            return intent
    return 'unknown'

from services.llm import ask
from services.kb import search

@chatbot_bp.route('/message', methods=['POST'])
def message():
    data = request.get_json()
    msg = data.get('message', '').strip()
    if not msg:
        return jsonify({'error': 'Message required'}), 400

    intent = detect_intent(msg)
    if intent in RESPONSES:
        reply = RESPONSES[intent]['reply']
    else:
        # Knowledge‑base search (top 3 hits)
        kb_hits = search(msg)
        kb_text = "\n".join(hit[0] for hit in kb_hits) if kb_hits else ""
        system_prompt = (
            "You are a helpful IT support assistant for a corporate environment. "
            "Provide concise, step‑by‑step troubleshooting. Use any relevant knowledge‑base snippets."
        )
        prompt = f"Question: {msg}\n\nRelevant KB snippets:\n{kb_text}" if kb_text else msg
        reply = ask(prompt, system_prompt)

    # Log to DB
    log = ChatLog(message=msg, reply=reply, intent=intent)
    db.session.add(log)
    db.session.commit()

    return jsonify({'reply': reply, 'intent': intent}), 200

"""
ML Ticket Classifier
Uses scikit-learn TF-IDF + RandomForest to classify tickets
into category (Network/Hardware/Software/Other) and priority (High/Medium/Low)
"""
import pickle, os
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline

# ─── Training Data ───────────────────────────────────────
TRAINING_DATA = {
    'texts': [
        # ── Network ─────────────────────────────────
        # High
        "entire office network down cannot access anything critical outage",
        "VPN not connecting remote work blocked cannot access company resources urgent",
        "server unreachable all services down production network failure",
        "internet down all employees affected business cannot operate",
        "firewall issue all traffic blocked critical network security breach",
        # Medium
        "WiFi not working cannot connect internet intermittent drops",
        "internet keeps disconnecting drops every few minutes",
        "network slow ping timeout packet loss occasional",
        "cannot access company portal network error sometimes",
        "DNS not resolving website not loading occasionally",
        # Low
        "WiFi signal weak in conference room meeting room poor signal",
        "network cable loose sometimes disconnects not urgent",
        "guest wifi slow not important but annoying",
        "printer not visible on network minor issue",
        "network drive occasionally takes long to load",

        # ── Hardware ────────────────────────────────
        # High
        "laptop not turning on black screen completely dead",
        "computer won't boot power button no response total failure",
        "hard drive failure disk not found data loss risk",
        "RAM memory failure blue screen crash repeated crashes cannot work",
        "server hardware failure all operations down critical",
        # Medium
        "keyboard not working some keys not responding",
        "mouse cursor frozen not moving intermittent",
        "monitor flickering display issues sometimes",
        "printer offline not printing sometimes",
        "USB port not working device not detected",
        # Low
        "headphone jack loose audio quality reduced minor",
        "scroll wheel on mouse slightly sticky not urgent",
        "monitor brightness button stuck low priority",
        "keyboard spacebar slightly stiff minor inconvenience",
        "mouse pad worn out needs replacement when possible",

        # ── Software ────────────────────────────────
        # High
        "system completely frozen cannot do any work critical",
        "antivirus found malware virus infection urgent security threat",
        "database corrupted data loss cannot access records critical",
        "ransomware encryption all files locked critical emergency",
        "cannot login to any system authentication completely broken blocking work",
        # Medium
        "outlook email not syncing authentication error intermittent",
        "system running slow freezing applications crash occasionally",
        "software license expired cannot open application",
        "windows update failed error code needs fixing",
        "excel word office application not opening sometimes",
        # Low
        "browser bookmark missing minor issue",
        "desktop wallpaper reset after reboot cosmetic issue",
        "app notification sound not working low priority",
        "dark mode not saving preference cosmetic",
        "software needs minor update not urgent",

        # ── Other ───────────────────────────────────
        # High
        "security badge not working cannot enter building locked out urgent",
        "emergency power outage UPS battery failure critical",
        # Medium
        "need new software installed approved request",
        "password forgot reset required cannot login",
        "office move equipment relocation planning needed",
        # Low
        "training required new system onboarding no rush",
        "request for additional monitor when available",
        "need ergonomic keyboard low priority request",
    ],
    'categories': [
        # Network High x5
        'Network','Network','Network','Network','Network',
        # Network Medium x5
        'Network','Network','Network','Network','Network',
        # Network Low x5
        'Network','Network','Network','Network','Network',
        # Hardware High x5
        'Hardware','Hardware','Hardware','Hardware','Hardware',
        # Hardware Medium x5
        'Hardware','Hardware','Hardware','Hardware','Hardware',
        # Hardware Low x5
        'Hardware','Hardware','Hardware','Hardware','Hardware',
        # Software High x5
        'Software','Software','Software','Software','Software',
        # Software Medium x5
        'Software','Software','Software','Software','Software',
        # Software Low x5
        'Software','Software','Software','Software','Software',
        # Other
        'Other','Other',
        'Other','Other','Other',
        'Other','Other','Other',
    ],
    'priorities': [
        # Network: High, Medium, Low
        'High','High','High','High','High',
        'Medium','Medium','Medium','Medium','Medium',
        'Low','Low','Low','Low','Low',
        # Hardware: High, Medium, Low
        'High','High','High','High','High',
        'Medium','Medium','Medium','Medium','Medium',
        'Low','Low','Low','Low','Low',
        # Software: High, Medium, Low
        'High','High','High','High','High',
        'Medium','Medium','Medium','Medium','Medium',
        'Low','Low','Low','Low','Low',
        # Other
        'High','High',
        'Medium','Medium','Medium',
        'Low','Low','Low',
    ]
}

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'classifier.pkl')

SOLUTIONS = {
    ('Network', 'High'):   'Immediate: Check physical connections, restart router/switch. Escalate to network team.',
    ('Network', 'Medium'): 'Try restarting your router and checking DNS settings. Run ipconfig /flushdns.',
    ('Network', 'Low'):    'Check network settings and run Windows Network Troubleshooter.',
    ('Hardware', 'High'):  'URGENT: Do not restart. Contact IT immediately for hardware replacement.',
    ('Hardware', 'Medium'): 'Restart the device. If issue persists, hardware inspection required.',
    ('Hardware', 'Low'):   'Check cable connections and device settings. Schedule hardware check.',
    ('Software', 'High'):  'Immediate software restoration needed. IT will remote in within 1 hour.',
    ('Software', 'Medium'): 'Restart the application. Try clearing cache or reinstalling.',
    ('Software', 'Low'):   'Check for software updates. Reinstall if issue persists.',
    ('Other', 'Low'):      'Your request has been logged. IT team will review within 24 hours.',
    ('Other', 'Medium'):   'Your request has been logged. IT team will review within 4 hours.',
    ('Other', 'High'):     'Your request has been escalated. IT team will contact you within 1 hour.',
}

class TicketClassifier:
    def __init__(self):
        self.category_model = None
        self.priority_model = None
        self._load_or_train()

    def _build_pipeline(self):
        return Pipeline([
            ('tfidf', TfidfVectorizer(max_features=500, ngram_range=(1, 2), stop_words='english')),
            ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
        ])

    def _load_or_train(self):
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                data = pickle.load(f)
                self.category_model = data['category']
                self.priority_model = data['priority']
        else:
            self.train()

    def train(self):
        texts = TRAINING_DATA['texts']
        self.category_model = self._build_pipeline()
        self.category_model.fit(texts, TRAINING_DATA['categories'])

        self.priority_model = self._build_pipeline()
        self.priority_model.fit(texts, TRAINING_DATA['priorities'])

        with open(MODEL_PATH, 'wb') as f:
            pickle.dump({'category': self.category_model, 'priority': self.priority_model}, f)

    def predict(self, title: str, description: str) -> dict:
        text = f"{title} {description}"
        category = self.category_model.predict([text])[0]
        priority = self.priority_model.predict([text])[0]
        suggested_fix = SOLUTIONS.get((category, priority), 'IT team will review your ticket shortly.')
        return {
            'category': category,
            'priority': priority,
            'suggested_fix': suggested_fix,
            'confidence': float(np.max(self.category_model.predict_proba([text])))
        }

# Singleton instance
classifier = TicketClassifier()

"""
ML Ticket Classifier
Uses a high-performance pure-Python TF-IDF + Cosine Similarity
classifier to predict categories and priorities without binary dependencies.
"""
import os, math, re

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
        self.texts = TRAINING_DATA['texts']
        self.categories = TRAINING_DATA['categories']
        self.priorities = TRAINING_DATA['priorities']
        self.train()

    def _tokenize(self, text):
        # Basic word extractor
        return re.findall(r'\w+', text.lower())

    def train(self):
        # Calculate DF and IDF
        self.df = {}
        self.num_docs = len(self.texts)
        self.doc_tokens = [self._tokenize(t) for t in self.texts]
        
        for tokens in self.doc_tokens:
            unique_tokens = set(tokens)
            for token in unique_tokens:
                self.df[token] = self.df.get(token, 0) + 1
                
        self.idf = {}
        for token, df_val in self.df.items():
            self.idf[token] = math.log((1 + self.num_docs) / (1 + df_val)) + 1
            
        self.tfidf_vectors = []
        for tokens in self.doc_tokens:
            vector = self._get_tfidf_vector(tokens)
            self.tfidf_vectors.append(vector)

    def _get_tfidf_vector(self, tokens):
        tf = {}
        for token in tokens:
            tf[token] = tf.get(token, 0) + 1
            
        vector = {}
        for token, tf_val in tf.items():
            if token in self.idf:
                vector[token] = tf_val * self.idf[token]
        return vector

    def _cosine_similarity(self, vec1, vec2):
        dot_product = sum(vec1[w] * vec2.get(w, 0) for w in vec1)
        mag1 = math.sqrt(sum(v**2 for v in vec1.values()))
        mag2 = math.sqrt(sum(v**2 for v in vec2.values()))
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot_product / (mag1 * mag2)

    def predict(self, title: str, description: str) -> dict:
        text = f"{title} {description}"
        tokens = self._tokenize(text)
        input_vector = self._get_tfidf_vector(tokens)
        
        similarities = []
        for i, doc_vector in enumerate(self.tfidf_vectors):
            sim = self._cosine_similarity(input_vector, doc_vector)
            similarities.append((sim, i))
            
        similarities.sort(reverse=True, key=lambda x: x[0])
        best_sim, best_idx = similarities[0] if similarities else (0.0, 0)
        
        category = self.categories[best_idx]
        priority = self.priorities[best_idx]
        
        if best_sim == 0:
            category = "Other"
            priority = "Low"
            
        suggested_fix = SOLUTIONS.get((category, priority), 'IT team will review your ticket shortly.')
        return {
            'category': category,
            'priority': priority,
            'suggested_fix': suggested_fix,
            'confidence': min(max(best_sim, 0.1), 0.99)
        }

# Singleton instance
classifier = TicketClassifier()

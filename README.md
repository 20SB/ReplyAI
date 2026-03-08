# ✨ ReplyAI

**Your smart contextual AI reply assistant**

ReplyAI helps you craft perfect message replies using AI that learns your communication style and generates responses that sound exactly like you.

---

## 🎯 Features

### ✅ Phase 1 MVP (Complete)

- **🤖 Personalized AI Replies**
  - Generates replies that sound like YOU
  - Uses your resume/profile to understand your voice
  - Multiple reply options per message
  - 6 different tone options

- **👥 Contact Management**
  - Save contacts with communication preferences
  - Track tone, emoji usage, and relationship notes
  - Search and organize contacts
  - View conversation history per contact

- **📜 Conversation History**
  - Automatic conversation tracking
  - Timeline view of all interactions
  - See AI suggestions vs what you actually sent
  - Learn from your reply patterns

- **🛠️ Reply Editing Tools**
  - Shorten replies (make concise)
  - Expand replies (add detail)
  - Change tone on the fly
  - Mark which reply you actually used

- **⚙️ User Settings**
  - Customize your communication style
  - Set default preferences (formality, emoji level)
  - Add common phrases you use
  - Define personality traits

---

## 🚀 Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, MongoDB (Mongoose)
- **AI:** Google Gemini 2.5 Flash
- **Deployment:** Vercel
- **Database:** MongoDB Atlas

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/20SB/ReplyAI.git
   cd ReplyAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🎨 Usage

### 1. Set Up Your Profile

- Go to **Settings** (⚙️)
- Add your name, profession, location
- Set communication preferences
- Add common phrases you use

### 2. Add Contacts

- Click **Contacts** (👥)
- Add contacts with their preferences
- Set tone, emoji level, and notes for each contact

### 3. Generate Replies

- Paste the message you received
- Select a contact (or type manually)
- Choose a tone
- Click "Generate AI Replies"

### 4. Edit & Use

- Use **Shorten** or **Expand** buttons
- Change tone with dropdown
- Copy the reply you like
- Mark it as "Used" for tracking

### 5. View History

- Open any contact
- Click "📜 History"
- See all past conversations and AI suggestions

---

## 📁 Project Structure

```
reply-ai/
├── app/
│   ├── api/                  # API routes
│   │   ├── contacts/         # Contact CRUD
│   │   ├── conversations/    # Conversation history
│   │   ├── generate-reply/   # AI reply generation
│   │   ├── edit-reply/       # Reply editing
│   │   └── user-profile/     # User settings
│   ├── contacts/             # Contacts pages
│   ├── settings/             # Settings page
│   └── page.tsx              # Main page
├── lib/
│   ├── ai/                   # AI logic
│   │   └── personalized-reply-generator.ts
│   ├── db/                   # Database
│   │   ├── models/           # Mongoose models
│   │   ├── mongoose.ts       # DB connection
│   │   └── seed-profile.ts   # Default profile
│   └── utils.ts
└── components/               # Reusable UI components
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy!

3. **Link GitHub for Auto-Deploy**
   - Go to Project Settings → Git
   - Connect repository
   - Enable auto-deploy on push

---

## 🎯 How It Works

### AI Personalization

ReplyAI uses your profile to generate replies that sound like you:

1. **Profile Analysis**
   - Reads your resume/bio
   - Extracts profession, skills, experience
   - Identifies communication patterns

2. **Contact Context**
   - Considers your relationship with the contact
   - Uses their communication preferences
   - Adapts tone based on past interactions

3. **Reply Generation**
   - Generates 3-5 different options
   - Each option has a distinct approach
   - Uses natural language (no robotic phrases)

4. **Learning Loop**
   - Tracks which replies you actually use
   - Saves conversation history
   - Improves over time (future feature)

---

## 📊 Database Models

### Contact
```typescript
{
  name: String,
  relation: String,
  communicationPreferences: {
    tone: String,
    emojiLevel: String,
    replySpeed: String
  },
  notes: [String],
  topics: [String],
  insideJokes: [String]
}
```

### Conversation
```typescript
{
  contactId: ObjectId,
  contactName: String,
  messages: [{
    role: String,
    content: String,
    timestamp: Date
  }],
  aiSuggestions: [String],
  selectedReply: String,
  userActualReply: String,
  metadata: {
    tone: String
  }
}
```

### UserProfile
```typescript
{
  name: String,
  profession: String,
  bio: String,
  communicationStyle: String,
  tonePreferences: {
    formality: String,
    humor: Boolean,
    emojis: String,
    responseLength: String
  },
  commonPhrases: [String],
  personalityTraits: [String]
}
```

---

## 🛣️ Roadmap

### Phase 2 (Planned)
- [ ] Share integration (Android share target)
- [ ] Voice input (Web Speech API)
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Learning from feedback
- [ ] Suggested replies based on patterns

### Phase 3 (Future)
- [ ] PWA with offline support
- [ ] Browser extension
- [ ] Mobile app (React Native)
- [ ] Team collaboration features
- [ ] Custom AI model fine-tuning
- [ ] Integration with messaging apps

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

MIT License - feel free to use this project however you like!

---

## 👨‍💻 Developer

**Subha Biswal**
- GitHub: [@20SB](https://github.com/20SB)
- Portfolio: [Your Portfolio URL]
- LinkedIn: [Your LinkedIn]

---

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Vercel for hosting
- MongoDB for database
- Next.js team for the framework

---

## 📧 Support

Have questions or issues? 

- Open an issue on GitHub
- Contact: subhabiswal20@gmail.com

---

**Built with ❤️ by Subha Biswal**

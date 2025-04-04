# AI Joke Generator

🎭 An AI-powered joke generator that creates personalized, witty jokes based on your preferences. Built with modern web technologies, this app offers a sleek dark-themed interface where you can customize joke topics, tones, and formats. Each joke comes with an AI evaluation of its shock value, creativity, and controversy levels.

## Features

- 🎯 Generate jokes with customizable topics, tones, and formats
- 🧠 AI-powered joke generation with creativity control
- 📊 Real-time joke evaluation with metrics
- 🌙 Modern, responsive UI with dark theme
- ✨ Interactive radio buttons with fancy animations

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Venice AI API

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd joke-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your Venice AI API key:
```
VENICE_API_KEY=your_venice_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

6. To create a new PR, create a branch for your feature or fix:
```bash
git checkout -b feature/add-new-joke-topics
```

7. Make and commit your changes:
```bash
git add .
git commit -m "😹 Added new joke topics"
```

8. Push Your Changes:
```bash
git push origin feature/add-new-joke-topics
```

9. Open a Pull Request (PR) 🎉

## API Integration

This application uses the Venice AI API for joke generation. The API key should be stored in the `.env.local` file as `VENICE_API_KEY`. The application makes direct HTTP requests to the Venice AI API endpoint at `https://api.venice.ai/api/v1/chat/completions`.

### Environment Variables

- `VENICE_API_KEY`: Your Venice AI API key (required)
  - Get your API key from [Venice AI](https://venice.ai)
  - Store it in `.env.local` file
  - Never commit this file to version control

## License

MIT

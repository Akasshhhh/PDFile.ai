# ChatPDF

A modern web application that allows users to upload PDF documents and interact with them using AI-powered chat. Built with Next.js, TypeScript, and LangChain.

## Features

- 📄 PDF document upload and processing
- 🤖 AI-powered chat interface for PDF interaction
- 🔍 Semantic search across PDF content
- 💾 Persistent chat history
- 🔐 User authentication with Clerk
- 💳 Pro subscription support with Stripe
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **AI/ML**: OpenAI, LangChain
- **Vector Database**: Pinecone
- **Authentication**: Clerk
- **File Storage**: AWS S3
- **Payments**: Stripe

## How It Works

### Document Processing
1. User uploads a PDF document
2. Document is stored in AWS S3
3. PDF is processed using LangChain's PDFLoader
4. Document is split into smaller chunks for better context management
5. Each chunk is converted to embeddings using OpenAI
6. Embeddings are stored in Pinecone vector database with metadata

### Chat Interface
1. User asks a question about the document
2. Question is converted to embeddings
3. Similar chunks are retrieved from Pinecone using semantic search
4. Retrieved chunks are used as context for the AI
5. OpenAI generates a response based on the context
6. Response is displayed to the user
7. Chat history is stored in PostgreSQL database

### Authentication & Pro Features
1. User authentication handled by Clerk
2. Pro subscription managed through Stripe
3. Access control for premium features
4. Persistent chat history across sessions

## Prerequisites

- Node.js 18+
- AWS S3 bucket
- Pinecone account
- OpenAI API key
- Clerk account
- Stripe account
- Neon database

## Environment Variables

Create a `.env` file with the following variables:

```env
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
DATABASE_URL=your_database_url
CLERK_SECRET_KEY=your_clerk_key
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatpdf.git
cd chatpdf
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign up/Login using Clerk authentication
2. Upload a PDF document
3. Start chatting with your document
4. Access chat history from the sidebar
5. Upgrade to Pro for additional features

## License

MIT

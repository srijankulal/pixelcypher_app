# PixelCypher

![PixelCypher Logo](public/Logo.png)

## A Secure Text-to-Image Encryption Tool

PixelCypher is a web application that allows users to encrypt text messages within images and decrypt them later. This application provides a seamless way to hide information in plain sight using steganography techniques.

## 🔐 Features

- **Text-to-Image Encryption**: Embed your secret messages securely within images
- **Image-to-Text Decryption**: Extract hidden messages from encrypted images
- **Secure Processing**: All encryption/decryption happens locally in your browser
- **User-Friendly Interface**: Simple, intuitive design for easy usage
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **No Data Storage**: Your messages and images aren't stored on any server

## 🚀 Use App

Check out the live application: [PixelCypher App](https://pixelcypher-app.vercel.app/)

## 💻 Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Ant Design components
- **Storage**: Vercel Blob Storage (for temporary image processing)
- **Deployment**: Vercel
- **Backend**: Spring Boot
- **API**: [pixelcypher-production.up.railway.app](https://pixelcypher-production.up.railway.app/) (https://github.com/srijankulal/pixelCypher_api)

## 📋 How It Works

1. **Select and upload an image** on the encryption page
2. **Enter your secret message** to be encrypted
3. **Click the Encrypt button** to process your image
4. **Download or copy** the encrypted image
5. **Decrypt the image** using our tool to reveal the hidden message

## 🛠️ Local Development

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pixelcypher_app.git
cd pixelcypher_app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a .env.local file in the root directory with the following variables:

```
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔍 Project Structure

```
pixelcypher_app/
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── encrypt/      # Encryption page
│   │   ├── decrypt/      # Decryption page
│   │   └── page.tsx      # Home page
│   ├── components/       # Reusable React components
│   │   ├── BackGround.tsx
│   │   ├── FloatButtons.tsx
│   │   ├── Header.tsx
│   │   └── upload.tsx
│   └── hooks/            # Custom React hooks
├── .env.local            # Environment variables (create locally, not in repo)
├── next.config.js        # Next.js configuration
└── package.json          # Project dependencies
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - [GitHub Profile](https://github.com/srijankulal)

<!-- ## 🙏 Acknowledgments

- UI/UX by [Disha](https://heroicons.com/) -->

---

Made with ❤️ by Srijan

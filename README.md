# CeylonMine Project Admin Portal

This is the Admin Portal for the CeylonMine project, built with Next.js and integrated with Supabase for backend services.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js**: Version 18.x or later
- **npm**: Comes with Node.js, used to install dependencies

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Thisal03/project-front.git
   cd project-front
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```plaintext
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   JWT_SECRET=
   ```

## Running the Application

To start the development server, run:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## Project Structure

- **/app**: Contains the main application components and pages
- **/components**: Reusable UI components
- **/api**: API routes for handling authentication and data operations
- **/styles**: Global styles and Tailwind CSS configuration

## Key Features

- **Authentication**: Secure login and logout using JWT and Supabase
- **Role Management**: Admins can manage user roles
- **Complaints Management**: View and manage complaints submitted by users
- **Responsive Design**: Built with Tailwind CSS for mobile-first design

## Troubleshooting

- **Node Module Errors**: Delete `node_modules` and run `npm install` again
- **Build Errors**: Delete the `.next` folder and restart the server
- **Environment Variables**: Ensure `.env.local` is correctly configured

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, please contact [thisalinduwara0379@gmail.com].

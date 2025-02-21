import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

// Export handlers and authentication functions from NextAuth configuration
export const {
  handlers: { GET, POST }, // HTTP handlers for GET and POST requests
  auth, // Authentication object
  signIn, // Function to sign in
  signOut, // Function to sign out
} = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login", // Custom sign-in page
  },
  callbacks: {
    // Callback to check if the user is authorized
    authorized({ auth, request }) {
      // Return true if user is authenticated
      return !!auth?.user;
    },
    // Callback to handle sign-in
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists in the database
        const existingUser = await getGuest(user.email);
        // Create a new guest if user does not exist
        if (!existingUser)
          await createGuest({ name: user.name, email: user.email });
        // Sign-in successful
        return true;
      } catch {
        // Sign-in failed
        return false;
      }
    },
    // Callback to handle session
    async session({ session, user }) {
      // Get guest data from the database
      const guest = await getGuest(session.user.email);
      // Attach guest ID to the session
      session.user.guestId = guest.id;
      // Return the session
      return session;
    },
  },
});

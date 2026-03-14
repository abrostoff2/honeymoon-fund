import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) return "/auth/error?reason=no-email";
      if (!allowedEmails.includes(profile.email.toLowerCase())) {
        return `/auth/error?reason=not-authorized&email=${encodeURIComponent(profile.email)}`;
      }
      return true;
    },
  },
});

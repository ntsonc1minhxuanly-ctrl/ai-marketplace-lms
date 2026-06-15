import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Định nghĩa mock users để test nhanh chóng không cần database/Google setup phức tạp
export const MOCK_USERS = [
  { id: "admin-id", name: "Nguyễn Admin", email: "admin@dev.com", role: "ADMIN", balance: 5000000, referralCode: "ref-admin" },
  { id: "user-id", name: "Trần Khách Hàng", email: "user@dev.com", role: "USER", balance: 150000, referralCode: "ref-user" },
  { id: "affiliate-id", name: "Lê Cộng Tác Viên", email: "affiliate@dev.com", role: "AFFILIATE", balance: 1200000, referralCode: "ref-aff" },
  { id: "instructor-id", name: "Phạm Giảng Viên", email: "instructor@dev.com", role: "INSTRUCTOR", balance: 800000, referralCode: "ref-inst" },
];

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Mock Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@dev.com" },
        password: { label: "Mật khẩu (bất kỳ)", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // Tìm kiếm mock user
        const matched = MOCK_USERS.find(u => u.email === credentials.email);
        if (matched) {
          return {
            id: matched.id,
            name: matched.name,
            email: matched.email,
            role: matched.role,
            balance: matched.balance,
            referralCode: matched.referralCode
          };
        }
        
        // Trả về mặc định nếu không khớp
        return {
          id: "guest-id",
          name: "Khách Vãng Lai",
          email: credentials.email,
          role: "USER",
          balance: 0,
          referralCode: "ref-guest"
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.balance = (user as any).balance;
        token.id = user.id;
        token.referralCode = (user as any).referralCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).balance = token.balance;
        (session.user as any).id = token.id;
        (session.user as any).referralCode = token.referralCode;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-dev-key-12345",
};

"use client";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, UserCircle2 } from "lucide-react"; // Icons

const Navbar = () => {
  const [user, setUser] = useState<null | User>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out error", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDropdownOpen) {
      timer = setTimeout(() => {
        setIsDropdownOpen(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [isDropdownOpen]);

  return (
    <>
      <Head>
        <title>Shopstrider - Shop Electronics, Mobiles, Grocery, and Books - Amazing Deals!</title>
        <meta name="description" content="Your one-stop-shop for electronics, mobiles, grocery, and books. Get exclusive deals on Apple iPhones, PC parts, grocery items, and books for competitive exams!" />
        <meta name="keywords" content="electronics, mobiles, grocery, books, Apple iPhones, PC parts, competitive exam books, grocery deals, online shopping" />
        <meta name="author" content="shopstrider" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <header className="bg-white shadow">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/cv_6.jpeg" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm font-bold text-black">
              {!user && (
                <>
                  <li><Link href="/" className="transition hover:text-black/75">Home</Link></li>
                  <li><Link href="/policy" className="transition hover:text-black/75">Policy</Link></li>
                </>
              )}
              <li>
                <Link href="/account" className="transition hover:text-black/75 flex items-center gap-1">
                  <UserCircle2 size={20} />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-black/75">Contact Us</Link>
              </li>
              <li>
                <Link href="/Cart" className="transition hover:text-black/75 flex items-center gap-1">
                  <ShoppingCart size={20} />
                </Link>
              </li>
              <li>
                <Link href="/Order" className="transition hover:text-black/75 flex items-center gap-1">
                  <Package size={20} /> Orders
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Navigation & User Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleDropdown} className="md:hidden block rounded bg-gray-100 p-2.5 text-black transition hover:text-black/75">
              <span className="sr-only">Toggle menu</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* User Auth & Dropdown Menu */}
            <div className="relative">
              {user ? (
                <button onClick={handleSignOut} className="hidden md:block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700">
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/login" className="hidden md:inline-block rounded-md bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700">
                    Login
                  </Link>
                  <Link href="/signup" className="hidden md:inline-block rounded-md bg-gray-100 px-5 py-2.5 text-sm font-bold text-teal-600 transition hover:text-teal-600/75">
                    Register
                  </Link>
                </>
              )}

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                  <nav className="p-4">
                    <ul className="space-y-2 text-black font-bold">
                      {!user ? (
                        <>
                          <li><Link href="/login" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75">Login</Link></li>
                          <li><Link href="/signup" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75">Register</Link></li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link href="/account" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75">
                              <UserCircle2 size={18} /> Account
                            </Link>
                          </li>
                          <li>
                            <Link href="/contact" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75">
                              Contact Us
                            </Link>
                          </li>
                          <li>
                            <Link href="/Cart" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75">
                              <ShoppingCart size={18} /> Cart
                            </Link>
                          </li>
                          <li>
                            <Link href="/Order" className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100 hover:text-black/75">
                              <Package size={18} /> Orders
                            </Link>
                          </li>
                          <li>
                            <button onClick={handleSignOut} className="flex items-center gap-2 rounded-lg px-4 py-2 w-full text-left hover:bg-gray-100 hover:text-black/75">
                              Logout
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

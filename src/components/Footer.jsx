import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

const Footer = () => {
    return (
        <div className="bg-base-300 text-base-content">
            <footer className="footer p-10 w-full px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <nav>
                    <h6 className="footer-title">StyleDecor</h6>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Your trusted partner for professional interior decoration and styling services. 
                        Transform your space into something extraordinary.
                    </p>
                </nav>

                {/* Contact Details */}
                <nav>
                    <h6 className="footer-title">Contact Us</h6>
                    <div className="flex flex-col gap-2">
                        <a className="link link-hover flex items-center gap-2 text-sm">
                            <FaPhone className="text-primary" />
                            <span>+880 1234-567890</span>
                        </a>
                        <a className="link link-hover flex items-center gap-2 text-sm">
                            <FaEnvelope className="text-primary" />
                            <span>info@styledecor.com</span>
                        </a>
                        <a className="link link-hover flex items-center gap-2 text-sm">
                            <FaMapMarkerAlt className="text-primary" />
                            <span>Dhaka, Bangladesh</span>
                        </a>
                    </div>
                </nav>

                {/* Working Hours */}
                <nav>
                    <h6 className="footer-title">Working Hours</h6>
                    <div className="text-sm space-y-1">
                        <p><strong>Saturday - Thursday:</strong></p>
                        <p>9:00 AM - 6:00 PM</p>
                        <p className="mt-2"><strong>Friday:</strong></p>
                        <p>Closed</p>
                    </div>
                </nav>

                {/* Social Media */}
                <nav>
                    <h6 className="footer-title">Follow Us</h6>
                    <div className="flex gap-4">
                        <a 
                            href="https://facebook.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-circle hover:btn-primary transition-all"
                            aria-label="Facebook"
                        >
                            <FaFacebook className="text-2xl" />
                        </a>
                        <a 
                            href="https://twitter.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-circle hover:btn-primary transition-all"
                            aria-label="Twitter"
                        >
                            <FaTwitter className="text-2xl" />
                        </a>
                        <a 
                            href="https://instagram.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-circle hover:btn-primary transition-all"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="text-2xl" />
                        </a>
                        <a 
                            href="https://linkedin.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-circle hover:btn-primary transition-all"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin className="text-2xl" />
                        </a>
                    </div>
                </nav>
            </footer>

            {/* Copyright Section */}
            <div className="border-t border-base-content/10">
                <div className="px-6 lg:px-12 py-6 text-center">
                    <p className="text-sm">
                        © {new Date().getFullYear()} StyleDecor. All rights reserved. | Designed with ❤️
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Footer
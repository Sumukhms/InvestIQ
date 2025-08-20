import React from 'react';

const TeamMemberCard = ({ name, role, avatar, social }) => (
    <div className="text-center">
        <img className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg" src={avatar} alt={name} />
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-red-500 font-medium">{role}</p>
        <div className="mt-3 flex justify-center space-x-4">
            <a href={social.linkedin} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
            <a href={social.twitter} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.295 1.634 4.208 3.801 4.649-.625.17-1.284.26-1.96.26-.305 0-.6-.03-1.893-.185.63 1.878 2.447 3.248 4.604 3.286-1.711 1.332-3.882 2.126-6.233 2.126-.404 0-.802-.023-1.195-.069 2.206 1.406 4.833 2.233 7.616 2.233 9.132 0 14.11-7.563 14.11-14.11l-.012-.639c.966-.695 1.798-1.562 2.457-2.549z"/></svg>
            </a>
        </div>
    </div>
);

const AboutPage = () => {
    return (
        <main>
            <section className="bg-white py-20 md:py-32">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
                        We're on a mission to democratize entrepreneurship.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Invest IQ was founded on a simple belief: a great idea shouldn't fail because of a lack of data. We provide the tools and insights to turn ambition into achievement.
                    </p>
                </div>
            </section>
            <section className="py-20">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1920&auto=format&fit=crop" alt="Team working together" className="rounded-lg shadow-xl"/>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Born from the challenges faced by our own founders, Invest IQ began as a tool to scratch our own itch. We were tired of the guesswork and the high cost of traditional market research. We knew there had to be a better way to validate ideas quickly and affordably.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Today, we've evolved into a comprehensive platform that empowers thousands of innovators, from solo founders to enterprise teams, to build the future with confidence.
                        </p>
                    </div>
                </div>
            </section>
            <section className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-4">
                            <h3 className="text-xl font-bold mb-2">Innovation</h3>
                            <p className="text-gray-600">We constantly push the boundaries of what's possible with AI.</p>
                        </div>
                        <div className="text-center p-4">
                            <h3 className="text-xl font-bold mb-2">Empowerment</h3>
                            <p className="text-gray-600">We give founders the tools they need to succeed on their own terms.</p>
                        </div>
                         <div className="text-center p-4">
                            <h3 className="text-xl font-bold mb-2">Integrity</h3>
                            <p className="text-gray-600">We believe in transparent, data-driven insights you can trust.</p>
                        </div>
                         <div className="text-center p-4">
                            <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                            <p className="text-gray-600">We succeed when our users succeed. We're partners in growth.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold">Meet the Innovators</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
                        <TeamMemberCard name="Spoorthi K" role="Founder & CEO" avatar="https://placehold.co/200x200/E0E0E0/333?text=SK" social={{linkedin: "#", twitter: "#"}} />
                        <TeamMemberCard name="Sumukh M S" role="Chief Technology Officer" avatar="https://placehold.co/200x200/E0E0E0/333?text=SM" social={{linkedin: "#", twitter: "#"}} />
                        <TeamMemberCard name="Varshini H Gowda" role="Head of Product" avatar="https://placehold.co/200x200/E0E0E0/333?text=VG" social={{linkedin: "#", twitter: "#"}} />
                        <TeamMemberCard name="Srikanth P V" role="Lead AI Engineer" avatar="https://placehold.co/200x200/E0E0E0/333?text=SP" social={{linkedin: "#", twitter: "#"}} />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default AboutPage;

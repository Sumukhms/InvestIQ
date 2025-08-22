import React from 'react';
// import Header from '../components/Header'; // Removed the import
// import Footer from '../components/Footer'; // Removed the import

// A component to display a single team member with a photo and social links
const TeamMemberCard = ({ name, role, avatar, social }) => (
    <div className="text-center p-6 rounded-2xl bg-white shadow-lg">
        <img className="w-32 h-32 rounded-full mx-auto mb-4 shadow-md" src={avatar} alt={name} />
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
    // Data for the team members with avatars and social links
    const teamMembers = [
        { name: 'Spoorthi K', role: 'Founder & CEO', avatar: 'https://placehold.co/200x200/E0E0E0/333?text=SK', social: { linkedin: '#', twitter: '#' } },
        { name: 'Sumukh M S', role: 'Chief Technology Officer', avatar: 'https://placehold.co/200x200/E0E0E0/333?text=SM', social: { linkedin: '#', twitter: '#' } },
        { name: 'Varshini H Gowda', role: 'Head of Product', avatar: 'https://placehold.co/200x200/E0E0E0/333?text=VG', social: { linkedin: '#', twitter: '#' } },
        { name: 'Srikanth P V', role: 'Lead AI Engineer', avatar: 'https://placehold.co/200x200/E0E0E0/333?text=SP', social: { linkedin: '#', twitter: '#' } },
    ];

    // Data for success stories
    const successStories = [
        {
            quote: "InvestIQ's analysis was a game-changer. It helped us identify a key market risk we hadn't considered and allowed us to pivot our strategy before launching. We're now three months post-launch and exceeding our revenue goals.",
            name: 'Sarah Chen',
            company: 'Nexus Innovations',
            title: 'Founder'
        },
        {
            quote: "The personalized recommendations from the AI were incredibly accurate and actionable. It felt like having a senior advisor in my pocket, guiding us through a crucial fundraising round.",
            name: 'Mark Davis',
            company: 'Evolve Health',
            title: 'CEO'
        },
        {
            quote: "Using InvestIQ saved us countless hours of market research. The platform's ability to instantly provide financial projections and competitor insights is unmatched.",
            name: 'Jessica Lee',
            company: 'Urban Bloom',
            title: 'Head of Strategy'
        }
    ];

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen flex flex-col">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-white py-20 md:py-32">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">
                            We're on a mission to democratize entrepreneurship.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                            InvestIQ was founded on a simple belief: a great idea shouldn't fail because of a lack of data. We provide the tools and insights to turn ambition into achievement.
                        </p>
                    </div>
                </section>
                {/* Our Story Section */}
                <section className="py-20 bg-white shadow-inner">
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
                {/* Our Core Values Section */}
                <section className="bg-gray-200 py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Our Core Values</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                                <p className="text-gray-600">We constantly push the boundaries of what's possible with AI.</p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                                <h3 className="text-xl font-bold mb-2">Empowerment</h3>
                                <p className="text-gray-600">We give founders the tools they need to succeed on their own terms.</p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                                <h3 className="text-xl font-bold mb-2">Integrity</h3>
                                <p className="text-gray-600">We believe in transparent, data-driven insights you can trust.</p>
                            </div>
                            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
                                <h3 className="text-xl font-bold mb-2">Collaboration</h3>
                                <p className="text-gray-600">We succeed when our users succeed. We're partners in growth.</p>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Success Stories Section */}
                <section className="py-20 bg-green-700">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">Success Stories</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {successStories.map((story, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
                                    <p className="text-gray-700 italic mb-4 flex-grow">"{story.quote}"</p>
                                    <div className="text-sm font-semibold text-red-600 mt-auto">{story.name}</div>
                                    <div className="text-xs text-gray-500">{story.title}, {story.company}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                {/* Meet the Innovators Section */}
                <section className="bg-gray-200 py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">Meet the Innovators</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
                            {teamMembers.map((member, index) => (
                                <TeamMemberCard 
                                    key={index}
                                    name={member.name}
                                    role={member.role}
                                    avatar={member.avatar}
                                    social={member.social}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;

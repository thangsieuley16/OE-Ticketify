export function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-black py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} TICKETIFY - OWNEGO. Internal Company Use Only.</p>
            </div>
        </footer>
    );
}

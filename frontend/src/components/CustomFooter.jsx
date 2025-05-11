export default function CustomFooter() {
    return (
        <footer className=' h-[25px] w-full'>
            <div className="h-[1px] bg-gradient-to-r from-blue-700 to-blue-400"></div>
            <div className="w-[80%] mx-auto text-sm text-center flex justify-between items-center">
                <span>
                    <span className="text-neutral-500">© {new Date().getFullYear()} developed by</span>
                    <a
                        href="https://www.linkedin.com/in/hcandido/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-500 hover:underline"
                    >
                        Harrison Caetano Candido.
                    </a>
                </span>
                <a
                    href="https://github.com/HarrisonCaetanoCandido/microservices-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 md:mt-0 ml-0 md:ml-4 text-blue-950 hover:text-blue-800 hover:underline transition-colors duration-300"
                >
                    Get Whatsapp Webhook API Code.
                </a>
            </div>
        </footer>
    );
}
interface HomeProps {
    dark: boolean
}

const Home = ({ dark }: HomeProps) => {
    return (
        <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 ${dark ? "bg-black text-white" : "bg-zinc-50 text-black"}`}>
            <div className="text-center space-y-4">
                <p className={`text-sm uppercase tracking-[0.35em] ${dark ? "text-zinc-500" : "text-zinc-400"}`}>Briksy</p>
                <h1 className='font-extrabold text-5xl md:text-8xl text-center'>Real Estate</h1>
                <p className={`max-w-xl mx-auto text-sm md:text-base ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                    Search properties, manage enquiries, and keep your seeker account connected with the Laravel backend.
                </p>
            </div>
        </div>
    )
}

export default Home

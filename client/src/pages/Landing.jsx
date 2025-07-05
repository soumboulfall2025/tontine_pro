import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const features = [
	{
		title: "Gestion digitale de votre tontine",
		desc: "Centralisez tous vos membres, cotisations et dettes dans un espace sécurisé, accessible partout.",
		icon: "💡",
	},
	{
		title: "Suivi des membres et paiements",
		desc: "Visualisez les cotisations, l’historique de chaque membre, et gardez le contrôle sur vos finances.",
		icon: "📊",
	},
	{
		title: "Sécurité & accès réservé",
		desc: "Actions critiques protégées, rôles admin/membre, connexion sécurisée pour tous.",
		icon: "🔒",
	},
];

const useCases = [
	"Tontines de quartier",
	"GIE et associations",
	"Femmes commerçantes",
	"Tontines professionnelles",
	"Familles et entreprises",
];

const testimonials = [
	{
		quote: "Grâce à TontinePro, on ne perd plus les comptes",
		author: "Awa, Pikine",
	},
	{
		quote: "Tout est automatisé, je gagne du temps",
		author: "Mame Diarra, GIE Diamono",
	},
];

export default function Landing() {
	const navigate = useNavigate();
	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			navigate("/dashboard");
		}
	}, [navigate]);

	return (
		<div className="min-h-screen bg-white flex flex-col font-sans">
			{/* Section Héros */}
			<section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 py-12 bg-gradient-to-br from-[#008037] to-[#CFAE51]/10">
				<div className="w-full md:w-1/2 flex flex-col gap-6 mx-auto items-center md:items-start">
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="text-3xl md:text-5xl font-extrabold text-[#008037] mb-2 text-center md:text-left"
					>
						Gérez vos tontines en toute simplicité
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.7 }}
						className="text-lg md:text-2xl text-gray-700 mb-4 text-center md:text-left"
					>
						TontinePro vous permet d’organiser vos cotisations, suivre les paiements, et envoyer des rappels automatiquement
					</motion.p>
					<div className="flex gap-4 mt-2 justify-center md:justify-start">
						<motion.a
							whileHover={{ scale: 1.05 }}
							href="https://tontine-pro-client.onrender.com/login"
							className="px-6 py-3 rounded-lg bg-[#008037] text-white font-bold shadow-lg transition hover:bg-[#00662a]"
						>
							Se connecter
						</motion.a>
					</div>
				</div>
			</section>

			{/* Fonctionnalités */}
			<section className="py-12 px-6 md:px-16 bg-[#f8faf7]">
				<h2 className="text-2xl md:text-3xl font-bold text-[#008037] mb-8 text-center">
					Fonctionnalités clés
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map((f, i) => (
						<motion.div
							key={f.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1, duration: 0.6 }}
							viewport={{ once: true }}
							className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center border-t-4 border-[#CFAE51]"
						>
							<div className="text-4xl mb-3">{f.icon}</div>
							<div className="font-bold text-lg text-[#008037] mb-2">
								{f.title}
							</div>
							<div className="text-gray-600 text-center">{f.desc}</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Cas d'utilisation */}
			<section className="py-12 px-6 md:px-16">
				<h2 className="text-2xl md:text-3xl font-bold text-[#008037] mb-8 text-center">
					Pour qui ?
				</h2>
				<div className="flex flex-wrap justify-center gap-4">
					{useCases.map((u) => (
						<motion.div
							key={u}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							viewport={{ once: true }}
							className="bg-[#008037]/10 text-[#008037] px-6 py-3 rounded-full font-semibold shadow-sm border border-[#008037]/20"
						>
							{u}
						</motion.div>
					))}
				</div>
			</section>

			{/* Témoignages */}
			<section className="py-12 px-6 md:px-16 bg-[#f8faf7]">
				<h2 className="text-2xl md:text-3xl font-bold text-[#008037] mb-8 text-center">
					Elles nous font confiance
				</h2>
				<div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
					{testimonials.map((t, i) => (
						<motion.div
							key={t.author}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1, duration: 0.6 }}
							viewport={{ once: true }}
							className="bg-white rounded-xl shadow-lg p-6 flex-1 border-l-4 border-[#CFAE51]"
						>
							<div className="italic text-gray-700 mb-3">“{t.quote}”</div>
							<div className="font-bold text-[#008037]">{t.author}</div>
						</motion.div>
					))}
				</div>
			</section>

			{/* Appel à l'action */}
			<section className="py-12 px-6 md:px-16 flex flex-col items-center gap-4 bg-gradient-to-t from-[#008037]/10 to-white">
				<motion.a
					whileHover={{ scale: 1.05 }}
					href="/login"
					className="px-8 py-4 rounded-lg bg-[#008037] text-white font-bold text-lg shadow-lg transition hover:bg-[#00662a]"
				>
					Se connecter à votre espace
				</motion.a>
				<motion.a
					whileHover={{ scale: 1.05 }}
					href="mailto:absamir2024@gmail.com"
					className="px-8 py-4 rounded-lg border-2 border-[#CFAE51] text-[#008037] font-bold text-lg shadow-sm transition hover:bg-[#CFAE51] hover:text-white bg-white"
				>
					Nous contacter
				</motion.a>
			</section>

			{/* Footer */}
			<footer className="py-8 px-6 md:px-16 bg-[#008037] text-white flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
				<div className="flex gap-4 mb-2 md:mb-0">
					<a href="#" className="hover:underline">
						À propos
					</a>
					<a href="mailto:absamir2024@gmail.com" className="hover:underline">
						Contact
					</a>
					<a href="#" className="hover:underline">
						Confidentialité
					</a>
				</div>
				<div className="flex gap-4">
					<a
						href="https://wa.me/221787203975"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[#CFAE51] text-xl"
					>
						<i className="fab fa-whatsapp"></i> WhatsApp
					</a>
					<a
						href="#"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[#CFAE51] text-xl"
					>
						<i className="fab fa-facebook"></i> Facebook
					</a>
					<a
						href="#"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-[#CFAE51] text-xl"
					>
						<i className="fab fa-instagram"></i> Instagram
					</a>
				</div>
				<div className="text-xs mt-2 md:mt-0">
					© {new Date().getFullYear()} TontinePro
				</div>
			</footer>
		</div>
	);
}

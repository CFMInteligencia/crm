export const REPO_URL = "https://github.com/trycompai/crm";
export const REPO_STARS = "4.4k";

export const REPO_LINKS = [
	{ label: "GitHub", href: REPO_URL },
	{ label: "Problemas", href: `${REPO_URL}/issues` },
	{ label: "Propostas de alteração", href: `${REPO_URL}/pulls` },
	{ label: "Como contribuir", href: `${REPO_URL}/blob/main/CONTRIBUTING.md` },
	{ label: "Licença", href: `${REPO_URL}/blob/main/LICENSE` },
] as const;

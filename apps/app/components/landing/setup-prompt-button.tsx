"use client";

import Checkmark from "@carbon/icons-react/es/Checkmark";
import Copy from "@carbon/icons-react/es/Copy";
import ClaudeLogo from "@crm/ui/components/brand-logos/claude";
import { Button } from "@crm/ui/components/button";
import { useState } from "react";
import { type CtaLocation, captureLanding } from "./analytics";

const SETUP_PROMPT =
	"Configure trycompai/crm: instale as dependências, inicie o Postgres, crie o .env e informe as chaves necessárias.";

/**
 * The page's leading action: hand the whole setup to a coding agent. It stands
 * where a "Get started" would, because on a repo you fork rather than sign up
 * for, taking the prompt is what getting started means.
 */
export function SetupPromptButton({ location }: { location: CtaLocation }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		await navigator.clipboard.writeText(SETUP_PROMPT);
		captureLanding("setup_prompt_copied", location);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Button
			variant="outline"
			size="xl"
			onClick={copy}
			aria-label="Copiar instruções de instalação"
		>
			<ClaudeLogo data-icon="inline-start" className="size-4" />
			{copied
				? "Copiado para a área de transferência"
				: "Copiar instruções de instalação"}
			{copied ? (
				<Checkmark
					data-icon="inline-end"
					className="ml-1.5 size-3.5 text-primary"
				/>
			) : (
				<Copy
					data-icon="inline-end"
					className="ml-1.5 size-3.5 text-muted-foreground"
				/>
			)}
		</Button>
	);
}

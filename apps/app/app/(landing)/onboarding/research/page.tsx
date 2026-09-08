import type { Metadata } from "next";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { requireMailboxAccess } from "@/lib/session";
import { ResearchForm } from "./research-form";

export const metadata: Metadata = {
	title: "Chave de pesquisa",
};

export const instant = false;

export default async function ResearchKeyPage() {
	await requireMailboxAccess();

	return (
		<AuthShell>
			<AuthHeading
				title="Complete os dados do CRM"
				description="Conecte o Context para pesquisar as empresas cadastradas no CRM."
			/>

			<ResearchForm />
		</AuthShell>
	);
}

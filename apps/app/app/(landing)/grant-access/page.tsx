import { type MailboxProviderId, mailboxGrantsNeeded } from "@crm/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthHeading, AuthShell } from "@/components/auth-shell";
import { requireSession, signInAccounts } from "@/lib/session";
import { GrantAccess } from "./grant-access";

export const metadata: Metadata = {
	title: "Autorizar acesso",
};

export const instant = false;

const DESCRIPTION = {
	google:
		"O CRM lê Gmail e Agenda para associar reuniões e e-mails às empresas. Nenhuma mensagem é enviada em seu nome.",
	microsoft:
		"O CRM lê o Outlook para associar e-mails às empresas. Nenhuma mensagem é enviada em seu nome.",
} satisfies Record<MailboxProviderId, string>;

const BOTH =
	"O CRM lê e-mails e agenda para associá-los às empresas. Nenhuma mensagem é enviada em seu nome.";

export default async function GrantAccessPage() {
	const { user } = await requireSession();

	const providers = mailboxGrantsNeeded(await signInAccounts(user.id));

	if (providers.length === 0) {
		redirect("/");
	}

	const only = providers.length === 1 ? providers[0] : undefined;

	return (
		<AuthShell>
			<AuthHeading
				title="Mais uma etapa"
				description={(only ? DESCRIPTION[only] : undefined) ?? BOTH}
			/>

			<GrantAccess providers={providers} />

			<p className="text-center text-muted-foreground text-sm/5">
				Apenas conversas com empresas do CRM são armazenadas. E-mails pessoais
				não são salvos.
			</p>
		</AuthShell>
	);
}

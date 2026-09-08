"use client";

import { authClient } from "@crm/auth/client";
import { Button } from "@crm/ui/components/button";
import { useState } from "react";
import { toast } from "sonner";

const CONNECT_ERRORS = new Map([
	["access_denied", "Instalação do Slack cancelada antes da autorização."],
	[
		"account_already_linked_to_different_user",
		"Esta conta do Slack já está associada a outra conta do CRM.",
	],
	[
		"email_doesn't_match",
		"O e-mail do Slack deve ser igual ao da conta conectada ao CRM.",
	],
	[
		"oauth_code_verification_failed",
		"O Slack recusou as credenciais ou o retorno OAuth. Verifique ID, segredo e URL de retorno e tente novamente.",
	],
	[
		"user_info_is_missing",
		"O Slack não retornou o perfil. Verifique as permissões users:read e users:read.email e reinstale o aplicativo.",
	],
]);

async function startSlackOAuth(slug: string) {
	try {
		const { error } = await authClient.oauth2.link({
			providerId: "slack",
			callbackURL: `${window.location.origin}/${slug}/settings/connections/slack/people`,
			errorCallbackURL: `${window.location.origin}/${slug}/settings/connections/slack?provider=slack`,
		});
		if (error)
			toast.error(error.message || "Não foi possível conectar o Slack.");
	} catch (error) {
		toast.error(
			error instanceof Error
				? error.message
				: "Não foi possível conectar o Slack.",
		);
	}
}

export function SlackReconnectButton({ slug }: { slug: string }) {
	const [pending, setPending] = useState(false);

	return (
		<Button
			disabled={pending}
			onClick={async () => {
				setPending(true);
				await startSlackOAuth(slug);
				setPending(false);
			}}
			size="xs"
			variant="contrast"
		>
			{pending ? "Abrindo Slack…" : "Reconectar"}
		</Button>
	);
}

export function SlackConnectButton({
	slug,
	configured,
	connectError,
}: {
	slug: string;
	configured: boolean;
	connectError?: string;
}) {
	const [pending, setPending] = useState(false);
	const connect = async () => {
		setPending(true);
		await startSlackOAuth(slug);
		setPending(false);
	};
	return (
		<div className="flex min-w-0 flex-col gap-2">
			<Button onClick={() => void connect()} disabled={!configured || pending}>
				{pending
					? "Abrindo Slack…"
					: configured
						? "Conectar Slack"
						: "Slack não configurado"}
			</Button>
			{connectError ? (
				<p role="alert" className="max-w-sm text-destructive text-xs">
					{CONNECT_ERRORS.get(connectError) ??
						`Não foi possível conectar o Slack (${connectError.replaceAll("_", " ")}).`}
				</p>
			) : null}
		</div>
	);
}

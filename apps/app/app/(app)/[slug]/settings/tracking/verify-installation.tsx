"use client";

import CheckmarkFilled from "@carbon/icons-react/es/CheckmarkFilled";
import Warning from "@carbon/icons-react/es/Warning";
import { Alert, AlertDescription, AlertTitle } from "@crm/ui/components/alert";
import { Button } from "@crm/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@crm/ui/components/card";
import { Field, FieldDescription, FieldLabel } from "@crm/ui/components/field";
import { Icon } from "@crm/ui/components/icon";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from "@crm/ui/components/input-group";
import { Spinner } from "@crm/ui/components/spinner";
import { StatusIndicator } from "@crm/ui/components/status-indicator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useId, useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";

type Result = RouterOutputs["tracking"]["verify"];

export function VerifyInstallation() {
	const trpc = useTRPC();
	const urlId = useId();

	const [url, setUrl] = useState("");
	const [result, setResult] = useState<Result | null>(null);

	const tracking = useQuery(trpc.tracking.settings.queryOptions());

	const verify = useMutation(
		trpc.tracking.verify.mutationOptions({
			onSuccess: (outcome) => setResult(outcome),
			onError: (error) => toast.error(error.message),
		}),
	);

	if (!tracking.data) return null;

	const { canManage, siteId } = tracking.data;

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<div className="flex items-center gap-2">
						Verificar instalação
						{result ? <Indicator result={result} /> : null}
					</div>
				</CardTitle>
				<CardDescription>
					Verificamos o script na página e, se necessário, no contêiner do Tag
					Manager.
				</CardDescription>

				<CardAction>
					<Button
						size="sm"
						type="submit"
						form="verify-tracking"
						disabled={!canManage || verify.isPending || url.trim() === ""}
					>
						{verify.isPending ? <Spinner data-icon="inline-start" /> : null}
						Verificar agora
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent>
				<form
					id="verify-tracking"
					onSubmit={(event) => {
						event.preventDefault();
						setResult(null);
						verify.mutate({ url: url.trim() });
					}}
				>
					<Field>
						<FieldLabel htmlFor={urlId}>Página para verificar</FieldLabel>
						<InputGroup>
							<InputGroupAddon>
								<InputGroupText>https://</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								id={urlId}
								value={url}
								onChange={(event) => {
									setUrl(event.target.value);
									setResult(null);
								}}
								placeholder="acme.com/pricing"
								autoComplete="off"
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck={false}
								inputMode="url"
								disabled={!canManage || verify.isPending}
							/>
						</InputGroup>
						<FieldDescription>
							A página deve ser pública. Páginas com login não podem ser
							verificadas.
						</FieldDescription>
					</Field>
				</form>

				{result && siteId ? <Outcome result={result} siteId={siteId} /> : null}
			</CardContent>
		</Card>
	);
}

function Indicator({ result }: { result: Result }) {
	if (result.status === "found" && result.pageView) {
		return (
			<StatusIndicator size="sm" tone="success" label="Verificado agora" />
		);
	}

	if (result.status === "found" && result.container?.carriesSiteId === false) {
		return (
			<StatusIndicator
				size="sm"
				tone="warning"
				label="O Tag Manager precisa de ajuste"
			/>
		);
	}

	return (
		<StatusIndicator
			size="sm"
			tone="warning"
			label={
				result.status === "found"
					? "Nenhuma visita registrada"
					: "Não detectado"
			}
		/>
	);
}

function Outcome({ result, siteId }: { result: Result; siteId: string }) {
	if (result.status === "unreachable") {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>Não foi possível abrir {result.host}</AlertTitle>
				<AlertDescription>
					{result.detail} A verificação aceita apenas páginas públicas e não
					acessa endereços privados.
				</AlertDescription>
			</Alert>
		);
	}

	if (result.status === "missing") {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>Nenhum script em {result.host}</AlertTitle>
				<AlertDescription>
					A página respondeu em {result.responseMs} ms, mas a tag não está no
					HTML. Insira a tag no cabeçalho, antes dos scripts que alteram a
					página.
					{result.containers.length > 0
						? ` Também verificamos o contêiner ${result.containers.join(" e ")} do Tag Manager, mas a tag não está nele.`
						: ""}
				</AlertDescription>
			</Alert>
		);
	}

	if (result.container && !result.container.carriesSiteId) {
		return (
			<Alert variant="destructive">
				<Icon icon={Warning} />
				<AlertTitle>O Tag Manager remove o ID do site</AlertTitle>
				<AlertDescription>
					Contêiner {result.container.id} contém a tag, mas falta o ID do site
					na URL do script. Substitua o HTML da tag pelo trecho indicado para o
					Tag Manager.
					{result.pageView
						? " A page view did arrive in the last five minutes, so something on this site is still recording."
						: ""}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<Alert>
			<Icon icon={CheckmarkFilled} className="text-success" />
			<AlertTitle>
				{result.container
					? `Script encontrado no contêiner ${result.container.id}`
					: `Script encontrado em ${result.host}`}
			</AlertTitle>
			<AlertDescription>
				Resposta em {result.responseMs} ms. O ID do site {siteId} corresponde, e
				este domínio está {result.allowed ? "" : "fora de"} na lista de
				permitidos.
				{result.container
					? "A tag depende do acionamento pelo Tag Manager. Uma visita registrada confirma o funcionamento."
					: ""}
				{result.pageView
					? " A page view arrived in the last five minutes."
					: "Nenhuma visita recebida. Abra a página no navegador para registrar uma visita."}
			</AlertDescription>
		</Alert>
	);
}

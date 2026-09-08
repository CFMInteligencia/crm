import Add from "@carbon/icons-react/es/Add";
import ArrowRight from "@carbon/icons-react/es/ArrowRight";
import ArrowUp from "@carbon/icons-react/es/ArrowUp";
import Attachment from "@carbon/icons-react/es/Attachment";
import ChevronDown from "@carbon/icons-react/es/ChevronDown";
import Renew from "@carbon/icons-react/es/Renew";
import Time from "@carbon/icons-react/es/Time";
import SlackLogo from "@crm/ui/components/brand-logos/slack";
import { cn } from "@crm/ui/lib/utils";
import Image from "next/image";
import type * as React from "react";
import { Chip } from "./chip";
import { SectionHeading } from "./section-heading";

export function AgentSection() {
	return (
		<section className="relative flex w-full shrink-0 flex-col items-center px-6 pt-20 md:pt-30">
			<div className="flex w-full max-w-6xl flex-col gap-12">
				<SectionHeading
					title="Agentes para automatizar seu CRM."
					lede="Descreva o que o CRM deve fazer. Crie agentes para automatizar processos."
				/>

				<div className="flex w-full flex-col items-center gap-7 rounded-xl border border-border bg-background px-6 py-12 md:px-12 md:py-[88px]">
					<p className="text-balance text-center font-medium text-2xl/8 tracking-[-0.01em] md:text-[32px]/10">
						O que vamos fazer hoje?
					</p>

					<Composer />
					<SuggestedActions />
				</div>
			</div>
		</section>
	);
}

function Composer() {
	return (
		<div className="flex min-h-24 w-3xl max-w-full shrink-0 select-none flex-col justify-between rounded-lg border border-[#3D3D3D] bg-muted p-[11px]">
			<p className="flex flex-wrap items-center gap-1 p-1 text-[13px]/6">
				<span className="text-[#00805E]">/Create agent</span>
				<span className="text-white">Enviar mensagem para</span>
				<Chip className="gap-1 text-white">
					<SlackLogo className="size-[15px] shrink-0" />
					Slack
				</Chip>
				<span className="text-white">e avisar</span>
				<Chip className="gap-1 text-white">
					<DanAvatar />
					Dan
				</Chip>
				<span className="text-white">
					quando uma empresa atrasar uma fatura
				</span>
			</p>

			<div className="flex items-center">
				<div className="flex items-center gap-[14px] text-muted-foreground">
					<Add size={16} />
					<Attachment size={16} />
					<span className="font-mono text-sm/4">/</span>
				</div>
				<div className="grow" />
				<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
					<ArrowUp size={14} className="text-primary-foreground" />
				</span>
			</div>
		</div>
	);
}

function SuggestedActions() {
	return (
		<div className="flex w-3xl max-w-full shrink-0 select-none flex-col pt-1">
			<div className="flex h-7 shrink-0 items-center gap-1.5 text-muted-foreground">
				<span className="text-[13px]/4">Ações sugeridas</span>
				<ChevronDown size={12} />
			</div>

			<SuggestedAction>
				<span className="shrink-0">Criar um</span>
				<Chip>
					<SlackLogo className="size-[14px] shrink-0" />
					Slack
				</Chip>
				<span className="shrink-0">
					canal e convidar o responsável quando o negócio atingir
				</span>
				<Chip className="gap-1.5 px-2">
					<span className="size-1.5 shrink-0 rounded-full bg-success" />
					Ganhos
				</Chip>
			</SuggestedAction>

			<SuggestedAction className="gap-3">
				<span className="shrink-0">Avisar</span>
				<Chip>
					<DanAvatar />
					Dan
				</Chip>
				<span className="min-w-0 grow">
					quando um contrato ficar cinco dias sem assinatura
				</span>
			</SuggestedAction>

			<SuggestedAction>
				<span className="shrink-0">Toda segunda-feira,</span>
				<Chip className="px-2">
					<Renew size={13} className="shrink-0" />
					atualizar dados dos contatos
				</Chip>
				<span className="shrink-0">sem contato há</span>
				<Chip className="px-2">
					<Time size={13} className="shrink-0 text-muted-foreground" />4 semanas
				</Chip>
			</SuggestedAction>
		</div>
	);
}

function SuggestedAction({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-3 border-border border-t py-[13px] text-[13px]/4">
			<span
				className={cn(
					"flex min-w-0 grow flex-wrap items-center gap-x-1.5 gap-y-2",
					className,
				)}
			>
				{children}
			</span>
			<ArrowRight size={16} className="shrink-0 text-muted-foreground" />
		</div>
	);
}

function DanAvatar() {
	return (
		<Image
			src="/landing/avatar-dan.png"
			alt=""
			width={64}
			height={64}
			className="size-[15px] shrink-0 rounded-full object-cover"
		/>
	);
}

import type { CarbonIcon } from "@crm/ui/components/icon";

export type AgentRecordKind = "contact" | "company" | "deal";

export type AgentRecord = { kind: AgentRecordKind; id: string };

type RecordCopy = {
	header: string;
	field: "contactId" | "companyId" | "dealId";
	title: string;
	blurb: string;
	placeholder: string;
	suggestions: string[];
};

type RecordCopyByKind = Record<AgentRecordKind, RecordCopy>;

export type AgentRecordHeader = Record<string, string>;

export type AgentRecordFilter = {
	contactId?: string;
	companyId?: string;
	dealId?: string;
};

const COPY: RecordCopyByKind = {
	contact: {
		header: "x-crm-contact",
		field: "contactId",
		title: "Perguntar sobre esta pessoa",
		blurb:
			"Cada etapa aparece durante a execução, incluindo contatos descartados.",
		placeholder: "Ainda trabalha nesta empresa?",
		suggestions: [
			"Quem é esta pessoa?",
			"Ainda trabalha nesta empresa?",
			"O que preciso saber antes da ligação?",
		],
	},
	company: {
		header: "x-crm-company",
		field: "companyId",
		title: "Perguntar sobre esta empresa",
		blurb:
			"Consulta o site e o histórico do relacionamento e apresenta as fontes.",
		placeholder: "O que esta empresa vende?",
		suggestions: [
			"O que esta empresa faz?",
			"Quem conhecemos aqui?",
			"O que mudou recentemente?",
		],
	},
	deal: {
		header: "x-crm-deal",
		field: "dealId",
		title: "Perguntar sobre este negócio",
		blurb: "Consulta conversas, reuniões e participantes do negócio.",
		placeholder: "Onde este negócio parou?",
		suggestions: [
			"Qual é a situação atual?",
			"Quem mais deve participar?",
			"Quais são os riscos?",
		],
	},
};

export function recordCopy(kind: AgentRecordKind): RecordCopy {
	return COPY[kind];
}

export function recordHeader(record: AgentRecord): AgentRecordHeader {
	return { [COPY[record.kind].header]: record.id };
}

export function recordFilter(record: AgentRecord): AgentRecordFilter {
	return { [COPY[record.kind].field]: record.id };
}

export type { CarbonIcon };

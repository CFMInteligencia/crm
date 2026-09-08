import type { RecordKind } from "@/components/crm/record-sheet/record-stack";
import type { FieldEntity } from "./fields-entity";

export const SHEET_TITLE = "Campos";

const SUBTITLE = {
	company: "Campos de todas as empresas do CRM.",
	contact: "Campos de todos os contatos do CRM.",
	deal: "Campos de todos os negócios do CRM.",
} satisfies Record<RecordKind, string>;

export function subtitleFor(kind: RecordKind): string {
	return SUBTITLE[kind];
}

export const STANDARD_ROW = "Campos padrão";
export const STANDARD_NOTE = "apenas ordenar e ocultar";
export const SUGGESTED_ROW = "Campos sugeridos";
export const SUGGESTED_NOTE = "adicionar com um clique";
export const ADD = "Adicionar";
export const CUSTOM_GROUP = "Campos personalizados";
export const DRAG_NOTE = "Arrastar para ordenar";
export const ARCHIVED_ROW = "Arquivado";
export const ARCHIVED_NOTE = "valores mantidos, campo oculto";
export const NEW_FIELD = "Novo campo";
export const ORDER_NOTE = "Esta ordem define a exibição na ficha";
export const MANUAL_ONLY = "Somente manual";
export const TABLE_NOTE = "também como coluna da tabela";
export const FILTER_NOTE = "também como filtro";

export const EMPTY_TITLE = "Nenhum campo personalizado";
export const EMPTY_BODY =
	"Crie campos que os agentes podem pesquisar e preencher.";

export const ERROR_TITLE = "Não foi possível carregar os campos";
export const ERROR_BODY =
	"Seus campos permanecem salvos. Tente novamente antes de criar novos campos.";
export const RETRY = "Tentar novamente";

export const LABEL_LABEL = "Rótulo";
export const KEY_LABEL = "Chave";
export const KEY_HELP =
	"Identificador usado pela API e pelos agentes. Após salvar, permanece fixo mesmo com a alteração do rótulo.";
export const AGENT_LABEL = "Permitir preenchimento pelos agentes";
export const AGENT_HELP =
	"Os agentes sugerem valores com fontes e preservam seus dados.";
export const BRIEF_LABEL = "Critérios da resposta";
export const BRIEF_HELP =
	"Deixe vazio para os agentes usarem apenas o rótulo e o tipo.";
export const TYPE_LABEL = "Tipo";
export const OPTIONS_LABEL = "Opções";
export const ADD_OPTION = "Adicionar opção";
export const ALL_FILLED = "Todos os campos preenchidos";

export function optionLabel(index: number): string {
	return `Opção ${index + 1}`;
}
export const ADD_FIELD = "Criar campo";
export const CANCEL = "Cancelar";
export const SAVE = "Salvar alterações";
export const ARCHIVE = "Arquivar";
export const FILL_REST = "Preencher restantes";

const SHEET_PLACEMENT = {
	COMPANY: "Exibir na ficha da empresa",
	CONTACT: "Exibir na ficha do contato",
	DEAL: "Exibir na ficha do negócio",
} satisfies Record<FieldEntity, string>;

const TABLE_PLACEMENT = {
	COMPANY: "Disponibilizar como coluna na tabela de empresas",
	CONTACT: "Disponibilizar como coluna na tabela de contatos",
	DEAL: "Disponibilizar como coluna na tabela de negócios",
} satisfies Record<FieldEntity, string>;

const FILTER_PLACEMENT = {
	COMPANY: "Disponibilizar como filtro na tabela de empresas",
	CONTACT: "Disponibilizar como filtro na tabela de contatos",
	DEAL: "Disponibilizar como filtro na tabela de negócios",
} satisfies Record<FieldEntity, string>;

export function sheetPlacement(entity: FieldEntity): string {
	return SHEET_PLACEMENT[entity];
}

export function tablePlacement(entity: FieldEntity): string {
	return TABLE_PLACEMENT[entity];
}

export function filterPlacement(entity: FieldEntity): string {
	return FILTER_PLACEMENT[entity];
}

export const ENTITY_TABS = [
	{ kind: "company", label: "Empresas" },
	{ kind: "contact", label: "Contatos" },
	{ kind: "deal", label: "Negócios" },
] as const satisfies readonly { kind: RecordKind; label: string }[];

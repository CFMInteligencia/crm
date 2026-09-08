type RunFailureReasons = Record<string, string>;

const REASONS: RunFailureReasons = {
	ACTION_NOT_PERFORMED:
		"O agente terminou sem concluir a tarefa. Abra a execução para verificar a etapa pendente.",
	NO_EXECUTOR:
		"O agente exige uma função indisponível no CRM. Recrie o agente.",
	DEPENDENCY_UNAVAILABLE:
		"Uma conexão necessária está ausente. Reconecte e execute novamente.",
	NOT_AUTHORISED: "A conexão recusou a ação. Verifique suas permissões.",
	PROVIDER_ERROR: "O serviço externo recusou a ação. Tente novamente.",
	NEVER_SETTLED:
		"O agente parou sem informar um resultado. Nenhuma ação ficou incompleta.",
	TURN_FAILED: "O modelo falhou durante a execução.",
	DELIVERY_FAILED: "A execução não chegou ao agente.",
	DELIVERY_EXHAUSTED:
		"A solicitação não chegou ao agente após três tentativas. Nada foi executado.",
	ACTION_REJECTED: "O CRM recusou a ação do agente. Nenhum dado foi gravado.",
	AGENT_UNAVAILABLE:
		"O agente estava pausado ou arquivado no início desta execução.",
	AGENT_DELETED: "O agente foi excluído antes do fim da execução.",
	CANCELLED_BY_USER: "Esta execução foi interrompida.",
	RUN_TIMED_OUT:
		"O tempo limite foi excedido. A execução foi interrompida para liberar as próximas.",
};

export function runFailureReason(
	code: string | null | undefined,
	message: string | null | undefined,
): string {
	const known = code ? REASONS[code] : undefined;
	if (known) return known;
	if (message?.trim()) return message.trim();
	return "A execução falhou sem informar o motivo.";
}

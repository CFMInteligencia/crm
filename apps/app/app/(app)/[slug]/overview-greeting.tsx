"use client";

import { useQueryState } from "nuqs";
import { PageShellDescription, PageShellTitle } from "@/components/page-shell";
import { SEARCH_PARAM } from "@/lib/search-param-keys";
import { overviewParsers } from "./overview-search-params";

export function OverviewGreetingFallback() {
	return (
		<>
			<PageShellTitle>Boas-vindas</PageShellTitle>
			<PageShellDescription>
				Seus resultados, negócios em andamento e prioridades de hoje.
			</PageShellDescription>
		</>
	);
}

export function OverviewGreeting() {
	const [scope] = useQueryState(
		SEARCH_PARAM.overview.scope,
		overviewParsers[SEARCH_PARAM.overview.scope],
	);

	return (
		<>
			<PageShellTitle>Boas-vindas</PageShellTitle>
			<PageShellDescription>
				{scope === "me"
					? "Seus resultados, negócios em andamento e prioridades de hoje."
					: "Os resultados da equipe, negócios em andamento e prioridades de hoje."}
			</PageShellDescription>
		</>
	);
}

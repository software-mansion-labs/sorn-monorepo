import { makeTea, DATA_TOKEN_ATTR } from "@devographics/i18n"
import { rscLocaleCached } from "~/lib/api/rsc-fetchers";

export async function rscTeapot({ contexts }: { contexts?: Array<string> } = {}) {
    const { locale, error } = await rscLocaleCached({ contexts })
    if (error) return { error }
    const t = makeTea(locale)
    return { t }
}

/**
 * A formatted message,
 * using a server component without hydration
 * 
 * It retrieves the current locale strings in the "server context"
 * setLocaleServerContext(localeId) must be called by the parent page
 * before this component is rendered
 * 
 * See Astro equivalent in the results-astro app
 * 
 * TODO: this is just a draft to check that everything is plugged
 * we should handle edge cases : children fallback, adding data attributes etc.
 */
export async function ServerT({ token }: { token: string }) {
    const { t, error } = await rscTeapot()
    if (error) return <span>Can't load locales</span>
    return <span {...{ [DATA_TOKEN_ATTR]: token }}>{t(token).t}</span>
}
import type { Entity } from "@devographics/types";
import { EditionMetadata, DbPaths } from "@devographics/types";
import { isAbsoluteUrl } from "~/lib/utils";
import { getSectioni18nIds } from "@devographics/i18n";
import type { Metadata } from "next";
import { publicConfig } from "~/config/public";
import { rscIntlContext } from "~/i18n/rsc-fetchers";
import { rscMustGetSurveyEditionFromUrl } from "~/app/[lang]/survey/[slug]/[year]/rsc-fetchers";
import { getCommonContexts, getEditionContexts } from "~/i18n/config";

/**
 * Get the main survey image,
 * handling legacy scenario of a relative image path
 *
 * @param edition
 * @returns A relative or absolute URL of the main survey image
 */
const variants = {
  og: "png",
  sidebar: "svg",
  square: "png",
};
export const getSurveyImageUrl = (
  edition: EditionMetadata,
  variant?: "og" | "sidebar" | "square"
) => {
  const variantSuffix = variant ? `-${variant}` : "";
  const extension = variant ? variants[variant] : "png";
  const imageUrl = `https://assets.devographics.com/surveys/${edition.id}${variantSuffix}.${extension}`;
  if (!imageUrl) return;
  let finalImageUrl = isAbsoluteUrl(imageUrl)
    ? imageUrl
    : // legacy behaviour
      `/surveys/${imageUrl}`;

  return finalImageUrl;
};

export const getEditionTitle = ({ edition }: { edition: EditionMetadata }) => {
  const { survey, year } = edition;
  const { name } = survey;
  return `${name} ${year}`;
};
export const getMetadata = async ({ params }: { params: any }) => {
  const { lang, sectionNumber } = params;
  const edition = await rscMustGetSurveyEditionFromUrl(params);

  const contexts = [...getCommonContexts(), ...getEditionContexts({ edition })];
  const intlContext = await rscIntlContext({ localeId: lang, contexts });

  const { socialImageUrl, year } = edition;
  const { name = "" } = edition.survey;

  const imageUrl = getSurveyImageUrl(edition);
  let imageAbsoluteUrl = socialImageUrl || imageUrl;
  const url = publicConfig.appUrl;
  const description = intlContext.formatMessage({
    id: "general.take_survey",
    values: { name, year: year + "" },
  });

  let title = getEditionTitle({ edition });

  const section =
    sectionNumber && edition.sections?.[parseInt(sectionNumber) - 1];

  if (section) {
    const { title: sectionTitleId } = getSectioni18nIds({ section });
    const sectionTitle = intlContext.formatMessage({ id: sectionTitleId });
    title += `: ${sectionTitle}`;
  }

  const meta: Metadata = {
    title,
    description,
    // NOTE: merge between route segments is shallow, you may need to repeat field from layout
    openGraph: {
      // @ts-ignore
      type: "article" as const,
      url,
      images: imageAbsoluteUrl,
    },
    twitter: {
      // @ts-ignore
      card: "summary" as const,
      images: imageAbsoluteUrl,
    },
    alternates: {
      canonical: url,
      // we could create alternates for languages too
    },
  };

  return meta;
};

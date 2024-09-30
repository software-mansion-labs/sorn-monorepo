import type { Metadata } from "next";
import { SectionProvider } from "~/components/SectionContext/SectionProvider";
import { rscGetSurveyEditionFromUrl } from "../../rsc-fetchers";
import { rscGetMetadata } from "~/lib/surveys/rsc-fetchers";
import { LANG, SURVEY_SLUG, SURVEY_YEAR } from "~/constants";

interface SurveySectionParams {
  sectionNumber: string;
}

export async function generateMetadata({
  params,
}: {
  params: SurveySectionParams;
}): Promise<Metadata | undefined> {
  const paramsExtended = {
    params: {
      lang: LANG,
      slug: SURVEY_SLUG,
      year: SURVEY_YEAR,
      sectionNumber: params.sectionNumber,
    },
  };
  return await rscGetMetadata(paramsExtended);
}

export default async function WithSectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: SurveySectionParams;
}) {
  const paramsExtended = {
    params: {
      lang: LANG,
      slug: SURVEY_SLUG,
      year: SURVEY_YEAR,
      sectionNumber: params.sectionNumber,
    },
  };

  const edition = await rscGetSurveyEditionFromUrl(paramsExtended.params);

  if (!edition) {
    throw new Error(
      `Could not find edition for params: ${JSON.stringify(params)}`
    );
  }

  return (
    // TODO: useParams should be enough, we don't need data fetching here
    // but it's not yet implemented in Next 13.0.6 (07/12/2022)
    <SectionProvider section={parseInt(params.sectionNumber)}>
      {children}
    </SectionProvider>
  );
}

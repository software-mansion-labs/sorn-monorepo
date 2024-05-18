import Surveys from "~/app/[lang]/(mainLayout)/Surveys";
import { RSCFetch } from "~/components/common/RSCFetch";
// import { DebugRSC } from "~/components/debug/DebugRSC";

import { rscFetchSurveysMetadata } from "~/lib/surveys/rsc-fetchers";

import { rscAllLocalesIds, rscLocaleFromParams } from "~/lib/api/rsc-fetchers";
import { DEFAULT_REVALIDATE_S } from "~/app/revalidation";
import { setLocaleIdServerContext } from "~/i18n/rsc-context";
import { NextPageParams } from "~/app/typings";
import { filterClientSideStrings } from "@devographics/i18n/server";

// revalidating is important so we get fresh values from the cache every now and then without having to redeploy
export const revalidate = DEFAULT_REVALIDATE_S;
export const dynamicParams = true;
export async function generateStaticParams() {
  const localeIds = await rscAllLocalesIds();
  return localeIds?.data.map((localeId) => ({ lang: localeId })) || [];
}

const IndexPage = async ({ params }: NextPageParams<{ lang: string }>) => {
  setLocaleIdServerContext(params.lang)
  const { locale, localeId, error } = await rscLocaleFromParams(params)
  if (error) return <div>Can't load translations</div>
  const tokenExprs = ["general.open_surveys"]
  const clientSideStrings = filterClientSideStrings<{}>(locale, tokenExprs, {})
  console.log({ clientSideStrings })

  return (
    <RSCFetch
      fetch={async () => rscFetchSurveysMetadata({ shouldThrow: false })}
      render={({ data: surveys }) => (
        <Surveys surveys={surveys} />
      )}
    />
  );
};

// "normal" version
// const IndexPage = async ({ params }) => {
//   const {
//     data: surveys,
//     ___metadata: ___rscFetchSurveysMetadata,
//     error,
//   } = await rscFetchSurveysMetadata();

//   if (error) {
//     return <div>{JSON.stringify(error, null, 2)}</div>;
//   } else {
//     return (
//       <>
//         <DebugRSC {...{ ___rscFetchSurveysMetadata }} />
//         <Surveys localeId={params.lang} surveys={surveys} />
//       </>
//     );
//   }
// };

export default IndexPage;

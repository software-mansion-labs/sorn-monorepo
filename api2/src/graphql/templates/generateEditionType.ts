import { graphqlize, mergeSections } from '../../generate/helpers'
import { Survey, Edition, Section } from '../../generate/types'

/*

Sample output:

type StateOfJs2021Edition {
    language: StateOfJs2021LanguageSection
    other_features: StateOfJs2021OtherFeaturesSection
    front_end_frameworks: StateOfJs2021FrontEndFrameworksSection
    back_end_frameworks: StateOfJs2021BackEndFrameworksSection
    other_tools: StateOfJs2021OtherToolsSection
    resources: StateOfJs2021ResourcesSection
    opinions: StateOfJs2021OpinionsSection
    user_info: StateOfJs2021UserInfoSection
}

*/

export const generateEditionType = ({
    survey,
    edition,
    path
}: {
    survey: Survey
    edition: Edition
    path: string
}) => {
    const typeName = `${graphqlize(edition.id)}Edition`
    const allSections = mergeSections(edition.sections, edition.apiSections)

    return {
        path,
        typeName,
        typeDef: `type ${typeName} {
    _metadata: EditionMetadata
    ${
        allSections.length > 0
            ? allSections
                  .map(
                      (section: Section) =>
                          `${section.id}: ${graphqlize(edition.id)}${graphqlize(section.id)}Section`
                  )
                  .join('\n    ')
            : 'empty: Boolean'
    }
}`
    }
}

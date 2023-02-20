import { Survey, Edition, Section, QuestionObject } from './types'
import { TypeObject, ResolverType } from './types'
import { getPath, getSectionQuestionObjects } from './helpers'

export const generateResolvers = async ({
    surveys,
    questionObjects,
    typeObjects
}: {
    surveys: Survey[]
    questionObjects: QuestionObject[]
    typeObjects: TypeObject[]
}) => {
    // generate resolver map for root survey fields (i.e. each survey)
    const surveysFieldsResolvers = Object.fromEntries(
        surveys.map((survey: Survey) => {
            return [
                survey.id,
                getSurveyResolver({
                    survey
                })
            ]
        })
    )

    const resolvers = {
        Query: { surveys: () => surveys },
        Surveys: surveysFieldsResolvers
    } as any

    for (const survey of surveys) {
        // generate resolver map for each survey field (i.e. each survey edition)
        const surveyFieldsResolvers = Object.fromEntries(
            survey.editions.map((edition: Edition) => {
                return [
                    edition.id,
                    getEditionResolver({
                        survey,
                        edition
                    })
                ]
            })
        )
        const surveyTypeObject = typeObjects.find(t => t.path === getPath({ survey }))
        if (surveyTypeObject) {
            resolvers[surveyTypeObject.typeName] = {
                _metadata: getSurveyMetadataResolver({ survey }),
                ...surveyFieldsResolvers
            }
        }

        for (const edition of survey.editions) {
            // generate resolver map for each edition field (i.e. each edition section)
            const editionTypeObject = typeObjects.find(t => t.path === getPath({ survey, edition }))
            if (editionTypeObject) {
                const editionFieldsResolvers = Object.fromEntries(
                    edition?.sections?.map((section: Section) => {
                        return [
                            section.id,
                            getSectionResolver({
                                survey,
                                edition,
                                section
                            })
                        ]
                    }) || []
                )

                resolvers[editionTypeObject.typeName] = {
                    _metadata: getEditionMetadataResolver({ survey, edition }),
                    ...(edition.sections ? editionFieldsResolvers : {})
                }
            }

            if (edition.sections) {
                for (const section of edition.sections) {
                    // generate resolvers for each section
                    const sectionTypeObject = typeObjects.find(
                        t => t.path === getPath({ survey, edition, section })
                    )

                    // make sure to get "rich" questions from questionObjects
                    // and not "raw" questions from edition.questions
                    const sectionQuestionObjects = getSectionQuestionObjects({
                        section,
                        edition,
                        questionObjects
                    })

                    if (sectionTypeObject) {
                        // generate resolver map for each section field (i.e. each section question)
                        resolvers[sectionTypeObject.typeName] = Object.fromEntries(
                            sectionQuestionObjects.map(questionObject => {
                                return [
                                    questionObject.id,
                                    getQuestionResolver({
                                        survey,
                                        edition,
                                        section,
                                        question: questionObject
                                    })
                                ]
                            })
                        )
                    }

                    for (const questionObject of sectionQuestionObjects) {
                        resolvers[questionObject.fieldTypeName] = {
                            all_years: getAllYearsResolver({
                                survey,
                                edition,
                                section,
                                question: questionObject
                            }),
                            year: getYearResolver({
                                survey,
                                edition,
                                section,
                                question: questionObject
                            })
                        }
                        // if (questionTypeObject) {

                        // }
                        // const questionObject = questionObjects({
                        //     survey,
                        //     edition,
                        //     section,
                        //     question
                        // })
                    }
                }
            }
        }
    }
    // console.log(resolvers)
    return resolvers
}

const getSurveyResolver =
    ({ survey }: { survey: Survey }): ResolverType =>
    (root, args, context, info) => {
        console.log('// survey resolver')
        return survey
    }

const getSurveyMetadataResolver =
    ({ survey }: { survey: Survey }): ResolverType =>
    (root, args, context, info) => {
        console.log('// survey metadata resolver')
        return survey
    }
const getEditionResolver =
    ({ survey, edition }: { survey: Survey; edition: Edition }): ResolverType =>
    (root, args, context, info) => {
        console.log('// editionresolver')
        return edition
    }

const getEditionMetadataResolver =
    ({ survey, edition }: { survey: Survey; edition: Edition }): ResolverType =>
    (root, args, context, info) => {
        console.log('// edition metadata resolver')
        return edition
    }

const getSectionResolver =
    ({
        survey,
        edition,
        section
    }: {
        survey: Survey
        edition: Edition
        section: Section
    }): ResolverType =>
    (root, args, context, info) => {
        console.log('// section resolver')
        return section
    }

const getQuestionResolver =
    ({
        survey,
        edition,
        section,
        question
    }: {
        survey: Survey
        edition: Edition
        section: Section
        question: QuestionObject
    }): ResolverType =>
    (root, args, context, info) => {
        console.log('// question resolver')
        return question
    }

const getAllYearsResolver =
    ({
        survey,
        edition,
        section,
        question
    }: {
        survey: Survey
        edition: Edition
        section: Section
        question: QuestionObject
    }): ResolverType =>
    (root, args, context, info) => {
        console.log('// getAllYearsResolver')
        return []
    }

const getYearResolver =
    ({
        survey,
        edition,
        section,
        question
    }: {
        survey: Survey
        edition: Edition
        section: Section
        question: QuestionObject
    }): ResolverType =>
    (root, args, context, info) => {
        console.log('// getYearResolver')
        console.log(args)
        return {}
    }

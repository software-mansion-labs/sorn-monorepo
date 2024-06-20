import { Dispatch, SetStateAction } from 'react'
import {
    Bucket,
    Entity,
    FacetBucket,
    FeaturesOptions,
    QuestionMetadata,
    SimplifiedSentimentOptions,
    StandardQuestionData
} from '@devographics/types'
import { BlockComponentProps } from 'core/types'
import { PERCENTAGE_QUESTION, SENTIMENT_FACET } from '@devographics/constants'
import { ChartStateWithSort, ChartValues, ColumnModes, OrderOptions, Tick } from '../common2/types'
import { DataSeries } from 'core/filters/types'

export const DEFAULT_VARIABLE = PERCENTAGE_QUESTION

export enum GroupingOptions {
    EXPERIENCE = 'experience',
    SENTIMENT = 'sentiment'
}

export type MultiItemSerie = DataSeries<StandardQuestionData[]>

export interface MultiItemsExperienceBlockProps extends BlockComponentProps {
    series: MultiItemSerie[]
}

export type ColumnId = FeaturesOptions | SimplifiedSentimentOptions

export type Variable = typeof PERCENTAGE_QUESTION

export type FacetId = string

export interface MultiItemsChartState extends ChartStateWithSort {
    facetId: FacetId
    setFacetId: Dispatch<SetStateAction<FacetId>>
    grouping: GroupingOptions
    setGrouping: Dispatch<SetStateAction<GroupingOptions>>
    variable: Variable
    setVariable: Dispatch<SetStateAction<Variable>>
    columnMode: ColumnModes
    setColumnMode: Dispatch<SetStateAction<ColumnModes>>
    rowsLimit: number
    setRowsLimit: Dispatch<SetStateAction<number>>
}

export interface MultiItemsChartValues extends ChartValues {
    maxOverallValue?: number
    totalRows: number
    facetQuestion?: QuestionMetadata
    ticks?: Tick[]
}

export type CombinedItem = {
    id: string
    entity: Entity
    combinedBuckets: CombinedBucket[]
    commentsCount: number
    count: number
}

export type CombinedBucket = {
    id: string
    ids: string[]
    bucket: Bucket
    facetBucket: FacetBucket
    value: number
    groupIndex: number
    subGroupIndex: number
}

export type Totals = { id: string } & { [key in ColumnId]: number }

export type MaxValue = { id: ColumnId; maxValue: number }

export type Dimension = {
    id: CombinedBucket['id']
    width: number
    offset: number
}
export type CellDimension = Dimension & {
    ids: CombinedBucket['ids']
}

export type ColumnDimension = Dimension

export type RowDataProps = {
    bucket: Bucket
    chartState: MultiItemsChartState
    chartValues: MultiItemsChartValues
}

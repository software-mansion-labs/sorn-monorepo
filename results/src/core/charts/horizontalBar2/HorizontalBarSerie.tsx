import React from 'react'
import { StandardQuestionData } from '@devographics/types'
import { CustomizationDefinition, CustomizationFiltersSeries, DataSeries } from 'core/filters/types'
import { getChartBuckets } from './helpers/other'
import { useChartValues } from './helpers/chartValues'
import { GridItem } from '../common2'
import { CommonProps } from '../common2/types'
import take from 'lodash/take'
import { CustomVariant } from 'core/filters/helpers'
import { BlockVariantDefinition } from 'core/types'
import { getViewComponent } from './helpers/views'

const getItemFilters = ({
    variant,
    block,
    serieIndex
}: {
    variant?: CustomVariant
    block?: BlockVariantDefinition
    serieIndex: number
}) => {
    const filtersState = variant?.chartFilters || block?.filtersState
    if (!filtersState) {
        return
    }
    const showDefaultSeries = filtersState?.options?.showDefaultSeries || false
    const defaultFilters: CustomizationFiltersSeries = { isDefault: true, conditions: [] }
    const filters = showDefaultSeries
        ? [defaultFilters, ...filtersState.filters]
        : filtersState?.filters
    const itemFilters = filters?.[serieIndex]
    return itemFilters
}

export const HorizontalBarSerie = (
    props: {
        serie: DataSeries<StandardQuestionData>
        serieIndex: number
    } & CommonProps
) => {
    const { serie, serieIndex, block, chartState, variant, question } = props
    const { rowsLimit } = chartState
    let buckets = getChartBuckets({ serie, block, chartState })
    const chartValues = useChartValues({ buckets, chartState, block, question })

    if (rowsLimit) {
        buckets = take(buckets, chartState.rowsLimit)
    }

    // let allRowOffsets = allRowsCellDimensions.map(cd =>
    //     getRowOffset({
    //         firstRowCellDimensions: allRowsCellDimensions[0],
    //         cellDimensions: cd,
    //         chartState
    //     })
    // )

    const viewProps = {
        ...props,
        buckets,
        chartValues
    }

    const itemFilters = getItemFilters({ variant, block, serieIndex })

    const ViewComponent = getViewComponent(chartState.view)

    return (
        <GridItem key={serie.name} filters={itemFilters}>
            <ViewComponent {...viewProps} />
        </GridItem>
    )
}

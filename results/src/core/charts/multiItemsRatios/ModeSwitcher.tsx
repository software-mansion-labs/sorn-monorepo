import React from 'react'
import { Modes, MultiRatiosChartState } from './types'
import { Toggle, ToggleItemType } from '../common2'
import { useI18n } from '@devographics/react-i18n'

const ModeSwitcher = ({ chartState }: { chartState: MultiRatiosChartState }) => {
    const { mode, setMode } = chartState
    const { getString } = useI18n()
    const items: ToggleItemType[] = Object.values(Modes).map(id => {
        return {
            id,
            isEnabled: mode === id,
            label: getString(`modes.${id}`)?.t
        }
    })
    return <Toggle labelId="charts.mode" items={items} handleSelect={setMode} />
}

export default ModeSwitcher

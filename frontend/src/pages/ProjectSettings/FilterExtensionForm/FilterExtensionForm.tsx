import { LoadingBar } from '@components/Loading/Loading'
import { useEffect, useState } from 'react'

import BorderBox from '@/components/BorderBox/BorderBox'
import { ToggleRow } from '@/components/ToggleRow/ToggleRow'
import { useProjectSettingsContext } from '@/pages/ProjectSettings/ProjectSettingsContext/ProjectSettingsContext'

export const FilterExtensionForm = () => {
	const [filterChromeExtension, setfilterChromeExtension] =
		useState<boolean>(false)
	const {
		allProjectSettings: data,
		loading,
		setAllProjectSettings,
	} = useProjectSettingsContext()

	useEffect(() => {
		if (!loading) {
			setfilterChromeExtension(
				data?.projectSettings?.filter_chrome_extension ?? false,
			)
		}
	}, [data?.projectSettings?.filter_chrome_extension, loading])

	if (loading) {
		return <LoadingBar />
	}

	const categories = [
		{
			key: 'Extension errors',
			message: 'Filter out errors thrown by chrome extensions',
			checked: filterChromeExtension,
		},
	]

	return (
		<>
			{categories.map((c) => (
				<BorderBox key={c.key}>
					{ToggleRow(
						c.key,
						c.message,
						c.checked,
						(isOptIn: boolean) => {
							setfilterChromeExtension(isOptIn)
							setAllProjectSettings((currentProjectSettings) =>
								currentProjectSettings?.projectSettings
									? {
											projectSettings: {
												...currentProjectSettings.projectSettings,
												filterChromeExtension: isOptIn,
											},
									  }
									: currentProjectSettings,
							)
						},
						false,
					)}
				</BorderBox>
			))}
		</>
	)
}

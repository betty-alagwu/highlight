import { Form, InputProps } from '@components/Form/Form'
import React, { useState } from 'react'

export interface TimeInputProps extends InputProps {
	initialValue?: string
	onTimeChange?: (value: string) => void
}

export function TimeInput({ placeholder, name, onTimeChange }: TimeInputProps) {
	const [value, setValue] = useState('')

	return (
		<Form.Input
			name={name}
			placeholder={placeholder}
			type="input"
			color={'n8'}
			value={value}
			style={{
				boxSizing: 'border-box',
				border: 'none',
				background: 'none',
			}}
			onChange={(event) => {
				setValue(event.target.value)
				onTimeChange?.(event.target.value)
			}}
		/>
	)
}

import React, { CSSProperties, Fragment } from 'react'
import { Box, BoxProps } from '../../Box/Box'
import { CalendarDay, useContextDaysPropGetters } from '@rehookify/datepicker'
import { ReactNode } from 'react'

const getColor = (day: CalendarDay) => {
	const { selected, disabled, range } = day

	if (disabled) {
		return 'n8'
	}

	if (selected) {
		return 'white'
	}

	if (range == 'will-be-range-start') {
		return 'white'
	}

	if (range == 'will-be-range-end') {
		return 'white'
	}

	return 'inherit'
}

const getContainerBorderTopLeftRadius = (day: CalendarDay) => {
	const { range, selected, now } = day

	if (selected && range === '') {
		return '6'
	}

	if (now && range === 'will-be-range-end') {
		return '6'
	}

	if (selected && range === 'range-start') {
		return '6'
	}

	if (now && selected) {
		return '6'
	}

	if (range === 'will-be-range-start') {
		return '6'
	}

	return 'inherit'
}

const getContainerBorderTopRightRadius = (day: CalendarDay) => {
	const { range, selected, now } = day

	if (selected && range === '') {
		return '6'
	}

	if (now && selected) {
		return '6'
	}

	if (selected && range === 'range-end') {
		return '6'
	}

	if (range === 'will-be-range-end' && 'will-be-range-start' && 'in-range') {
		return '6'
	}

	return 'inherit'
}

const getContainerBorderBottomLeftRadius = (day: CalendarDay) => {
	const { range, selected, now } = day

	if (selected && range === '') {
		return '6'
	}

	if (now && range === 'will-be-range-end') {
		return '6'
	}

	if (now && selected) {
		return '6'
	}

	if (selected && range === 'range-start') {
		return '6'
	}

	if (range === 'will-be-range-start') {
		return '6'
	}

	return 'inherit'
}

const getContainerBorderBottomRightRadius = (day: CalendarDay) => {
	const { range, selected, now } = day

	if (now && selected) {
		return '6'
	}

	if (selected && range === '') {
		return '6'
	}

	if (selected && range === 'in-range') {
		return 'inherit'
	}

	if (range === 'will-be-range-end') {
		return '6'
	}
	return 'inherit'
}

const getContainerBackgroundColor = (day: CalendarDay) => {
	const { selected, range, now } = day

	if (now && selected) {
		return 'p9'
	}

	if (now && range === 'will-be-range-end') {
		return 'p9'
	}

	if (now && range === 'will-be-in-range') {
		return 'p6'
	}

	if (
		selected ||
		range === 'will-be-range-end' ||
		range === 'will-be-range-start'
	) {
		return 'p6'
	}

	return 'inherit'
}

const getBackgroundColor = (day: CalendarDay) => {
	const { selected, range, now } = day

	if (now) {
		return 'lb300'
	}

	if (selected) {
		return 'p9'
	}

	if (range == 'will-be-range-end') {
		return 'p9'
	}

	if (range == 'will-be-range-start') {
		return 'p9'
	}

	if (range == 'will-be-in-range') {
		return 'p6'
	}

	if (range == 'in-range') {
		return 'p6'
	}

	return 'inherit'
}

const getBorderRadius = (day: CalendarDay) => {
	const { selected, range, now } = day

	if (now) {
		return 'round'
	}

	if (selected) {
		return '6'
	}

	if (range == 'will-be-range-start') {
		return '6'
	}

	if (range == 'will-be-range-end') {
		return '6'
	}

	return 'inherit'
}

const getPointer = (day: CalendarDay) => {
	const { disabled } = day

	return disabled ? 'not-allowed' : 'pointer'
}

const getWidth = (day: CalendarDay) => {
	const { now } = day

	if (now) {
		return '24px'
	}

	return '100%'
}

const containerStyles: CSSProperties = {
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}

interface Props {
	children: ReactNode
	day: CalendarDay
}

const Day = ({ children, day }: Props) => {
	const { dayButton } = useContextDaysPropGetters()

	const Wrapper = day.now ? Box : Fragment

	const WrapperProps = day.now
		? ({
				style: containerStyles,
				backgroundColor:
					day.range === 'will-be-in-range' ||
					day.range === 'in-range' ||
					day.range === 'will-be-range-end' ||
					day.selected
						? 'p6'
						: 'inherit',
				borderTopRightRadius:
					day.range === 'range-end' ||
					day.range === 'will-be-range-end'
						? '6'
						: 'inherit',
				borderBottomRightRadius:
					day.range === 'range-end' ||
					day.range === 'will-be-range-end'
						? '6'
						: 'inherit',
		  } as BoxProps)
		: {}

	return (
		<Wrapper {...WrapperProps}>
			<Box
				{...dayButton(day)}
				cursor={getPointer(day)}
				style={containerStyles}
				backgroundColor={getContainerBackgroundColor(day)}
				borderTopLeftRadius={getContainerBorderTopLeftRadius(day)}
				borderTopRightRadius={getContainerBorderTopRightRadius(day)}
				borderBottomLeftRadius={getContainerBorderBottomLeftRadius(day)}
				borderBottomRightRadius={getContainerBorderBottomRightRadius(
					day,
				)}
			>
				<Box
					color={getColor(day)}
					backgroundColor={getBackgroundColor(day)}
					padding="10"
					style={{
						width: getWidth(day),
						height: getWidth(day),
						...(day.now
							? {
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
							  }
							: {}),
					}}
					borderTopLeftRadius={getBorderRadius(day)}
					borderBottomLeftRadius={getBorderRadius(day)}
					borderTopRightRadius={getBorderRadius(day)}
					borderBottomRightRadius={getBorderRadius(day)}
				>
					{children}
				</Box>
			</Box>
		</Wrapper>
	)
}

export { Day }

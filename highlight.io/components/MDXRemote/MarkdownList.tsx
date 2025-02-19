export function MarkdownList(
	props: React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
		HTMLUListElement | HTMLOListElement
	>,
) {
	console.log('HI')
	return (
		<>
			{Array.isArray(props.children) &&
				props?.children?.map((c: any, i: number) => {
					return (
						c.props &&
						c.props.children && (
							<ul
								style={{
									paddingLeft: 40,
								}}
							>
								<li
									style={{
										listStyleType: 'disc',
										listStylePosition: 'outside',
									}}
									key={i}
								>
									{c.props.children.map
										? c?.props?.children?.map((e: any) => e)
										: c?.props?.children}
								</li>
							</ul>
						)
					)
				})}
		</>
	)
}

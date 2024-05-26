import '@radix-ui/themes/styles.css';

import { Avatar, Box, Card, Flex, Text } from '@radix-ui/themes';

import { Members } from './CardTable';

interface memberProps {
	member: Members;
}

export default function UserCard(props: memberProps) {
	return (
		<div className="mb-6">
			<Box width="500px">
				<Card
					size="3"
					style={{
						backgroundColor: `${props.member.team}`,
					}}
				>
					<Flex gap="4" align="center">
						<Avatar
							size="5"
							radius="full"
							fallback="T"
							src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
						/>
						<Box>
							<Text as="div" size="4" weight="bold">
								{props.member.name}
							</Text>
							<Text as="div" size="4" color="gray">
								{props.member.email}
							</Text>
						</Box>
					</Flex>
				</Card>
			</Box>
		</div>
	);
}

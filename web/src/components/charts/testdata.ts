function generateTestData(numbers: number[]) {
	return numbers.map((num, index) => {
		return {
			name: (index + 1).toString(),
			number: num,
		};
	});
}

export const TEST_DATA_FB_FORMAT = {
	reviews: {
		'01_tomato_breaking_bad_6': {
			author: 'Michael Scott',
			content:
				'Breaking bad is a compelling story of a high school chemistry teacher turned methamphetamine manufacturing drug dealer, with gripping storytelling and character development that keeps you on the edge of your seat.',
			created: 'Apr 10, 2000',
			rating: 3.5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Recommended',
			type: 'Human',
		},
		'02_tomato_breaking_bad_6': {
			author: 'Dwight Schrute',
			content:
				'It is a must watch for anyone who loves crime dramas. The show is a perfect blend of drama, action, and comedy. The characters are well developed and the story is engaging. Highly recommended.',
			created: 'May 11, 2000',
			rating: 4.5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Highly Recommended',
			type: 'Human',
		},
		'03_tomato_breaking_bad_6': {
			author: 'Pam Beesly',
			content:
				'Breaking Bad is a great show that keeps you on the edge of your seat. The story is well written and the characters are well developed. The show is a must watch for anyone who loves crime dramas.',
			created: 'Jun 12, 2000',
			rating: 4,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Highly Recommended',
			type: 'Human',
		},
		'04_tomato_breaking_bad_6': {
			author: 'Jim Halpert',
			content:
				'I was really looking forward to watching Breaking Bad, but I was disappointed. The story is slow and the characters are not well developed. The show is not worth watching.',
			created: 'Jul 13, 2000',
			rating: 2,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Disappointing',
			type: 'Human',
		},
		'05_tomato_breaking_bad_6': {
			author: 'Andy Bernard',
			content:
				'We all know that Breaking Bad is a great show, but it is not for everyone. The show is dark and intense, and the characters are not very likable. I would recommend it to anyone who loves crime dramas.',
			created: 'Aug 14, 2000',
			rating: 4,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Highly Recommended',
			type: 'Human',
		},
		'06_tomato_breaking_bad_6': {
			author: 'Angela Martin',
			content:
				"I've been watching Breaking Bad since the beginning and it just keeps getting better and better. The writing is superb and the acting is top-notch. This show is a must-watch for any TV enthusiast.",
			created: 'Sep 15, 2000',
			rating: 5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Outstanding',
			type: 'Human',
		},
		'07_tomato_breaking_bad_6': {
			author: 'Kevin Malone',
			content:
				"Breaking Bad is one of the best shows I've ever watched. The story is gripping and the characters are so well developed. I can't wait to see how it all ends.",
			created: 'Oct 16, 2000',
			rating: 4.5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Amazing',
			type: 'Human',
		},
		'08_tomato_breaking_bad_6': {
			author: 'Creed Bratton',
			content:
				'This show is an absolute thrill ride from start to finish. The evolution of the main character is both disturbing and captivating.',
			created: 'Apr 10, 2000',
			rating: 4.5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Unmissable',
			type: 'Human',
		},
		'09_tomato_breaking_bad_6': {
			author: 'Oscar Martinez',
			content:
				'The narrative complexity of Breaking Bad is unmatched. It’s a brilliant showcase of how to mix moral conundrums with intense drama.',
			created: 'May 11, 2000',
			rating: 4.8,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Masterpiece',
			type: 'Human',
		},
		'10_tomato_breaking_bad_6': {
			author: 'Phyllis Vance',
			content:
				"Every episode leaves you wanting more. The tension and pacing are perfect. It's a heart-pounding experience.",
			created: 'Jun 12, 2000',
			rating: 4.2,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Edge of Your Seat',
			type: 'Human',
		},
		'11_tomato_breaking_bad_6': {
			author: 'Stanley Hudson',
			content:
				"The show starts strong but sometimes feels repetitive. It's good, but not the best I've seen.",
			created: 'Jul 13, 2000',
			rating: 3.0,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Somewhat Repetitive',
			type: 'Human',
		},
		'12_tomato_breaking_bad_6': {
			author: 'Meredith Palmer',
			content:
				"Raw and intense, Breaking Bad delivers a cinematic experience in every episode. It's definitely not for the faint of heart.",
			created: 'Aug 14, 2000',
			rating: 4.7,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Intense',
			type: 'Human',
		},
		'13_tomato_breaking_bad_6': {
			author: 'Kelly Kapoor',
			content:
				"The drama is good, but I wish there were more relatable characters. It's hard to find someone to root for.",
			created: 'Sep 15, 2000',
			rating: 3.8,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Needs More Heart',
			type: 'Human',
		},
		'14_tomato_breaking_bad_6': {
			author: 'Ryan Howard',
			content:
				'Breaking Bad redefines the crime drama genre with its innovative storytelling and complex characters.',
			created: 'Oct 16, 2000',
			rating: 4.9,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Redefines the Genre',
			type: 'Human',
		},
		'15_tomato_breaking_bad_6': {
			author: 'Toby Flenderson',
			content:
				"It's well-made, but sometimes the moral ambiguity of the protagonist is too unsettling.",
			created: 'Apr 10, 2000',
			rating: 3.5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Morally Unsettling',
			type: 'Human',
		},
		'16_tomato_breaking_bad_6': {
			author: 'Jan Levinson',
			content:
				'Absolutely gripping! The show brilliantly explores the darkness of its characters.',
			created: 'May 11, 2000',
			rating: 5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Gripping and Dark',
			type: 'Human',
		},
		'17_tomato_breaking_bad_6': {
			author: 'David Wallace',
			content:
				'Breaking Bad is an example of television at its best. The storytelling is precise and captivating.',
			created: 'Jun 12, 2000',
			rating: 4.6,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Television at Its Best',
			type: 'Human',
		},
		'18_tomato_breaking_bad_6': {
			author: 'Roy Anderson',
			content: 'I find the show too dark and the pacing slow, not my cup of tea.',
			created: 'Jul 13, 2000',
			rating: 2.5,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Too Dark',
			type: 'Human',
		},
		'19_tomato_breaking_bad_6': {
			author: 'Darryl Philbin',
			content:
				'Breaking Bad mixes brilliant acting with a compelling story that’s both unpredictable and satisfying.',
			created: 'Aug 14, 2000',
			rating: 4.3,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Unpredictable and Satisfying',
			type: 'Human',
		},
		'20_tomato_breaking_bad_6': {
			author: 'Holly Flax',
			content:
				"The emotional depth in Breaking Bad is incredible. Each character's journey is beautifully portrayed.",
			created: 'Sep 15, 2000',
			rating: 4.4,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Emotionally Deep',
			type: 'Human',
		},
		'21_tomato_breaking_bad_6': {
			author: 'Michael Scott',
			content:
				"Absolutely a game-changer in the landscape of TV shows. It's thrilling, emotional, and impeccably produced.",
			created: 'Oct 16, 2000',
			rating: 4.8,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Game Changer',
			type: 'Human',
		},
		'22_tomato_breaking_bad_6': {
			author: 'Gabe Lewis',
			content:
				'While the show is critically acclaimed, I find the heavy themes a bit too much to handle.',
			created: 'Apr 10, 2000',
			rating: 3.2,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Overwhelming Themes',
			type: 'Human',
		},
		'23_tomato_breaking_bad_6': {
			author: 'Todd Packer',
			content:
				"If you love intense dramas, this is it. It's raw, gritty, and has no dull moments.",
			created: 'May 11, 2000',
			rating: 4.1,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Raw and Gritty',
			type: 'Human',
		},
		'24_tomato_breaking_bad_6': {
			author: 'Pam Beesly',
			content:
				'This show is a masterclass in storytelling. It’s complex, intriguing, and always entertaining.',
			created: 'Jun 12, 2000',
			rating: 4.9,
			show: 'breaking_bad_6',
			source: 'Rotten Tomato',
			title: 'Masterclass in Storytelling',
			type: 'Human',
		},
	},
	shows: {
		breaking_bad_6: {
			category: 'Crime',
			name: 'Breaking Bad',
			release_date: 'Apr 2, 2000',
			review_ids: ['01_tomato_breaking_bad', '02_tomato_breaking_bad'],
			season: 6,
		},
	},
};

export const TEST_DATA = generateTestData([
	3.8576624536149833, 4.8589676776239905, 3.3464633160633093, 4.23983456034865,
	4.591481824812644, 3.3299948568927826, 4.19635966480689, 3.6899531645708725,
	4.942042995976135, 4.1432316449962245, 4.7636315549175094, 4.488410320711517,
	3.547180987341898, 3.9259139539160226, 4.20638046849835, 3.348359172297451,
	3.313656967448115, 4.327857300779574, 2.7890790012386253, 4.145989704257637,
	3.705899485030724, 2.9208328811402398, 2.5287171729302016, 4.0409554078893155,
	3.8033264720484494, 4.332786066290433, 3.250186876289258, 3.0430350451951518,
	4.476395031413181, 3.779947717415378, 3.77460535296488, 4.612676242144662,
	4.816174846631432, 3.8529046276686905, 2.412448298730343, 4.649556447756877,
	2.287524199980942, 2.8460888902939985, 4.280342956354647, 3.569076650067892,
	2.479644869073664, 2.355467375602669, 4.291001148195774, 4.046642855434595,
	3.346999329078949, 2.8135343179523806, 2.5835893323207175, 3.9004389213168036,
	2.3428642143663, 4.315447465952284, 4.888017785507709, 4.324923829976264,
	3.166282285426856, 3.054768720294674, 4.727771895151106, 3.614531175553024,
	3.0535809977250525, 4.774416353284482, 4.853778071971363, 4.004380271152071,
	4.456012594993624, 3.3246743815359463, 4.557824607778583, 4.337884336922068,
	3.0619303538381364, 3.0319025749896618, 4.691146566560833, 2.969455068128272,
	3.214978304304764, 1.7623383100459997, 3.8770899531440017, 4.816751501106957,
	3.959679928318403, 4.219554317955072, 3.9766191197552105, 4.277033781844452,
	3.5133239667187146, 3.7743625693993597, 4.547554982914582, 2.784521935372336,
	4.08734574644693, 4.699487488119413, 3.417776113374991, 2.054297383269497,
	4.075703151184829, 4.8153406523024325, 3.616966825817383, 3.8917112694125446,
	3.9782775996100046, 4.133447199767618, 4.950199904484208, 4.546393591285585,
	4.154831824302002, 4.077461867161887, 2.957465584039081, 3.1612441996701612,
	4.358069105046785, 3.7604914513944196, 4.570695159495151, 2.3015221944914774,
	3.5175173343330615, 4.112284312185865, 3.9205519274693916, 3.9938651625523773,
	2.3811093095137967, 3.9932523629852925, 4.343389099290363, 2.4088430148223,
	4.532353540769121, 4.542824694579833, 3.5949437327154645, 2.3511162828072285,
	4.4130172550581985, 4.065611998193234, 2.447919816664185, 4.362570897828788,
	3.6670518367378735, 3.5348782473063842, 4.233175226743371, 3.9847778504773412,
	3.5244217772375874, 3.9808116971395227, 3.4396409841072253, 4.244820662425775,
	2.5209274995367306, 3.4124621850643777, 3.4410664036908107, 2.828278497465958,
	3.8409164433358587, 3.212521730484534, 4.1570752692158965, 4.437262332640771,
	4.111604878014558, 4.687948004592846, 2.890973736854024, 2.400630024329473,
	2.92305535858722, 4.94915992649579, 2.889202567728146, 1.604714835312925,
	4.616993880400103, 2.7530150915105045, 4.250754151148513, 4.298966656311871,
	1.5589289640021966, 3.4859150046490623, 4.779751174522607, 4.050934627303774,
	3.8798529133115984, 2.618872382025924, 4.508209587454409, 2.9654665027992375,
	3.5000581301706077, 2.2908400664602135, 3.8573082269276053, 3.3119454268208655,
	2.2854829791548052, 4.57229095219274, 4.36241276839861, 3.924842685746009,
	4.587829744528821, 3.527158828393552, 3.1406052392687753, 3.498098866140124,
	1.1567894077102459, 4.1960369666959485, 2.390095001798033, 2.49696075926029,
	0.7993735568842202, 3.4313634527937613, 4.284365128552151, 3.615716367822267,
	3.6615817214532393, 4.194631125444035, 3.8982722095776237, 2.9076225544528147,
	2.403627969342301,
]);

export const TEST_DATA1 = [
	{
		name: '1',
		number: 1,
	},
	{
		name: '2',
		number: 5,
	},
	{
		name: '3',
		number: 2,
	},
	{
		name: '4',
		number: 4,
	},
	{
		name: '5',
		number: 4,
	},
	{
		name: '6',
		number: 2,
	},
	{
		name: '7',
		number: 5,
	},
];

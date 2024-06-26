const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const animeQuotes = [
    "\"If you don’t like your destiny, don’t accept it. Instead, have the courage to change it the way you want it to be!\" - Naruto Uzumaki (Naruto)",
    "\"If you don’t take risks, you can’t create a future!\" - Monkey D. Luffy (One Piece)",
    "\"It’s just pathetic to give up on something before you even give it a shot.\" - Reiko Mikami (Another)",
    "\"People’s lives don’t end when they die, it ends when they lose faith.\" - Itachi Uchiha (Naruto)",
    "\"The moment you think of giving up, think of the reason why you held on so long.\" - Natsu Dragneel (Fairy Tail)",
    "\"Destiny. Fate. Dreams. These unstoppable ideas are held deep in the heart of man. As long as there are people who seek freedom in this life, these things shall not vanish from the Earth.\" - Gol D. Roger (One Piece)",
    "\"Don’t start a fight if you can’t end it.\" - Sanji (One Piece)",
    "\"Fear is not evil. It tells you what your weakness is. And once you know your weakness, you can become stronger, as well as kinder.\" - Gildarts Clive (Fairy Tail)",
    "\"Learn to treasure your life because unfortunately, it can be taken away from you anytime.\" - L Lawliet (Death Note)",
    "\"Don’t give up, there’s no shame in falling down! True shame is to not stand up again!\" - Shintaro Midorima (Kuroko no Basket)",
    "\"Whatever you lose, you’ll find it again. But what you throw away you’ll never get back.\" - Kenshin Himura (Rurouni Kenshin)",
    "\"Life is not a game of luck. If you wanna win, work hard.\" - Sora (No Game No Life)",
    "\"Every journey begins with a single step. We just have to have patience.\" - Milly Thompson (Trigun)",
    "\"It’s not the face that makes someone a monster, it’s the choices they make with their lives.\" - Naruto Uzumaki (Naruto)",
    "\"Power comes in response to a need, not a desire. You have to create that need.\" - Son Goku (Dragon Ball)",
    "\"The only way to truly escape the mundane is for you to constantly be evolving. Whether you choose to aim high, or aim low. Enjoy each day for what it is.\" - Izaya Orihara (Durarara!!)",
    "\"The ticket to the future is always open.\" - Vash the Stampede (Trigun)",
    "\"If you only face forward, there is something you will miss seeing.\" - Vash the Stampede (Trigun)",
    "\"To know sorrow is not terrifying. What is terrifying is to know you can’t go back to happiness you could have.\" - Matsumoto Rangiku (Bleach)",
    "\"No matter how deep the night, it always turns to day, eventually.\" - Brook (One Piece)",
    "\"Even if I can’t see you… No matter how far away you may be… I will always be watching you.\" - Makarov Dreyar (Fairy Tail)",
    "\"Miracles don’t happen by just sitting around. We have to make them happen ourselves.\" - Kiyoshi Fujino (Prison School)",
    "\"A person grows up when he’s able to overcome hardships. Protection is important, but there are some things that a person must learn on his own.\" - Jiraiya (Naruto)",
    "\"You should enjoy the little detours to the fullest. Because that’s where you’ll find the things more important than what you want.\" - Ging Freecss (Hunter x Hunter)",
    "\"If you can’t do something, then don’t. Focus on what you can do.\" - Shiroe (Log Horizon)",
    "\"There’s no such thing as a painless lesson. They just don’t exist. Sacrifices are necessary. You can’t gain anything without losing something first.\" - Edward Elric (Fullmetal Alchemist)",
    "\"Hard work betrays none, but dreams betray many.\" - Hachiman Hikigaya (My Youth Romantic Comedy Is Wrong, As I Expected)",
    "\"Sometimes I do feel like I’m a failure. Like there’s no hope for me. But even so, I’m not gonna give up. Ever!\" - Deky aka Izuku Midoriya (My Hero Academia)",
    "\"It’s not always possible to do what we want to do, but it’s important to believe in something before you actually do it.\" - Might Guy (Naruto)",
    "\"A real sin is something you can never atone for.\" - Ban (The Seven Deadly Sins)",
    "\"The world isn’t perfect. But it’s there for us, doing the best it can… that’s what makes it so damn beautiful.\" - Roy Mustang (Fullmetal Alchemist)",
    "\"If you begin to regret, you’ll dull your future decisions and let others make your choices for you.\" - Erwin Smith (Attack on Titan)",
    "\"You can die anytime, but living takes true courage.\" - Kenshin Himura (Rurouni Kenshin)",
    "\"Even if armed with hundreds of weapons… there are times when you just can’t beat a man with a spear of conviction in his gut.\" - Red Leg Zeff (One Piece)",
    "\"I refuse to let my fear control me anymore.\" - Maka Albarn (Soul Eater)",
    "\"No matter how scared you are, you should smile to show that you’re okay. Because in this world, the ones who are smiling are the strongest.\" - Nana Shimura (My Hero Academia)",
    "\"If you can’t find a reason to fight, then you shouldn’t be fighting.\" - Akame (Akame ga Kill)",
    "\"Do exactly as you like. That is the true meaning of pleasure. Pleasure leads to joy and joy leads to happiness.\" - Gilgamesh (Fate/Zero)",
    "\"The only home that a man should ever need is within his heart.\" - Lavi Bookman (D.Gray-man)",
    "\"If you turn your eyes away from sad things, they’ll happen again one day. If you keep running away, you’ll keep repeating the same mistakes. That’s why you have to face the truth straight on.\" - Riki Naoe (Little Busters!)",
    "\"A lesson without pain is meaningless for you cannot gain something without sacrificing something else in return.\" - Edward Elric (Fullmetal Alchemist)",
    "\"We are all like fireworks. We climb, shine, and always go our separate ways and become further apart. But even if that time comes, let’s not disappear like a firework, and continue to shine… forever.\" - Hitsugaya Toushiro (Bleach)",
    "\"If you don’t have the courage to change things, then you might as well just die.\" - Natsu Dragneel (Fairy Tail)",
    "\"Pain is your friend; it is your ally. Pain tells you when you have been seriously wounded. And you know what’s the best thing about pain? It tells you that you’re not dead yet!\" - Ken Kaneki (Tokyo Ghoul)",
    "\"The only thing we’re allowed to do is to believe that we won’t regret the choice we made.\" - Levi Ackerman (Attack on Titan)",
    "\"You don’t need a reason to live. You just live.\" - Nero Vanetti (91 Days)",
    "\"The world is not beautiful; therefore it is.\" - Kino (Kino’s Journey)",
    "\"When you hit the point of no return, that’s the moment it truly becomes a journey. If you can still turn back, it’s not really a journey.\" - Hinata Miyake (A Place Further than the Universe)",
    "\"People become stronger because they have memories they can’t forget.\" - Tsunade (Naruto)",
    "\"If you don’t like the hand that fate’s dealt you with, fight for a new one.\" - Naruto Uzumaki (Naruto)",
    "\"An excellent leader must be passionate because it’s their duty to keep everyone moving forward.\" - Nico Yazawa (Love Live! School Idol Project)",
    "\"If I don’t stand up here… If I don’t reach higher here… When am I ever going to do it?\" - Bell Cranel (Is It Wrong to Try to Pick Up Girls in a Dungeon?)",
    "\"When you’re scared, it’s all the more reason to move forward.\" - Kittan Bachika (Gurren Lagann)",
    "\"Strength isn’t just about winning. Even if my attempts are pathetic and comical, and even if I’m covered in the mud of my defeat, if I can keep fighting and look up at the sky as I lie on the ground, that alone is proof of true strength!\" - Haruyuki Arita (Accel World)",
    "\"If you pretend to feel a certain way, the feeling can become genuine all by accident.\" - Hei (Darker than Black)",
    "\"Stand up and walk. Move on. After all, you have perfect legs to stand on.\" - Edward Elric (Fullmetal Alchemist)",
    "\"Mistakes are not shackles that halt one from stepping forward. Rather, they are that which sustain and grow one’s heart.\" - Mavis Vermillion (Fairy Tail)",
    "\"The past you’ve lost will never come back. I myself have made so many mistakes… But we can learn from the past so we don’t repeat it.\" - Korosensei (Assassination Classroom)",
    "\"To know what is right and choose to ignore it is the act of a coward.\" - Kakashi Hatake (Naruto)",
    "\"If you win, you live. If you lose, you die. If you don’t fight, you can’t win!\" - Eren Yeager (Attack on Titan)",
    "\"People's lives don't end when they die. It ends when they lose their faith.\" - Kenzo Tenma (Monster)",
    "\"No one knows what the future holds. That's why its potential is infinite.\" - Makise Kurisu (Steins;Gate)",
    "\"If the king doesn’t move, then his subjects won’t follow.\" - Lelouch Vi Britannia (Code Geass)",
    "\"Even if you feel it's useless, I want you to be yourself. Just take your time. For now, you can just take the first step. Only you can decide your future.\" - Emilia (Re:Zero)",
    "\"It's not the face that makes someone a monster; it's the choices they make with their lives.\" - Shinya Kogami (Psycho-Pass)",
    "\"It is the fate of all living beings to eventually die. But as long as we live, we want to be with others. We want to connect with others. That's how we're made.\" - Kaworu Nagisa (Neon Genesis Evangelion)",
    "\"If you don’t share someone’s pain, you can never understand them.\" - Nagato (Naruto)",
    "\"If you really want to become strong, stop caring about what others think about you. Living your life has nothing to do with what others think.\" - Saitama (One Punch Man)",
    "\"The circumstances of one’s birth are irrelevant, but it is what you do with the gift of life that determines who you are.\" - Mewtwo (Pokémon: The First Movie)",
    "\"The world cannot be changed with pretty words alone.\" - Lelouch vi Britannia (Code Geass)",
    "\"I’m not going to die because I’m the one who will protect you!\" - Asuna Yuuki (Sword Art Online)",
    "\"The world is cruel, but it’s also very beautiful.\" - Mikasa Ackerman (Attack on Titan)",
    "\"We have to live a life of no regrets.\" - Portgas D. Ace (One Piece)",
    "\"In this world, there is no such thing as coincidence; there is only inevitability.\" - Yūko Ichihara (xxxHolic)",
    "\"Hurt me with the truth. But never comfort me with a lie.\" - Erza Scarlet (Fairy Tail)",
    "\"You should never give up on life, no matter how you feel. No matter how badly you want to give up.\" - Canaan (Canaan)",
    "\"Life is like a tube of toothpaste. When you’ve used all the toothpaste down to the last squeeze, that’s when you’ve really lived. Live with all your might, and struggle as long as you have life.\" - Mion Sonozaki (Higurashi When They Cry)",
    "\"The world won’t change, you must change yourself in this world.\" - Hachiman Hikigaya (My Youth Romantic Comedy Is Wrong, As I Expected)",
    "\"No matter how hard or impossible it is, never lose sight of your goal.\" - Monkey D. Luffy (One Piece)",
    "\"To act is not necessarily compassion. True compassion sometimes comes from inaction.\" - Hinata Miyake (A Place Further than the Universe)",
    "\"If you don’t like your destiny, don’t accept it. Instead, have the courage to change it the way you want it to be.\" - Naruto Uzumaki (Naruto)",
    "\"Whenever humans encounter the unknown, they tend to lose perspective.\" - Knov (Hunter x Hunter)",
    "\"When you confront those who lurk in the darkness, you also envelop yourself in it.\" - Skull Knight (Berserk)",
    "\"If you want to grant your own wish, then you should clear your own path to it.\" - Rintaro Okabe (Steins;Gate)",
    "\"Don’t live your life making up excuses. The one making your choices is yourself.\" - Mugen (Samurai Champloo)",
    "\"A dropout will beat a genius through hard work.\" - Rock Lee (Naruto)",
    "\"If you think of someone’s good qualities as the umeboshi in an onigiri, it’s as if their qualities are stuck to their back!\" - Tohru Honda (Fruits Basket)",
    "\"Sometimes, people are just mean. Don’t fight mean with mean. Hold your head high.\" - Hinata Miyake (A Place Further than the Universe)",
    "\"I hate perfection. To be perfect is to be unable to improve any further.\" - Kurotsuchi Mayuri (Bleach)",
    "\"People who can’t throw something important away, can never hope to change anything.\" - Armin Arlert (Attack on Titan)",
    "\"The difference between the novice and the master is that the master has failed more times than the novice has tried.\" - Korosensei (Assassination Classroom)",
    "\"There isn’t any shame in being weak, the shame is in staying weak.\" - Fuegoleon Vermillion (Black Clover)",
    "\"Don’t worry about what other people think. Hold your head up high and plunge forward.\" - Izuku Midoriya (My Hero Academia)",
    "\"We evolve beyond the person we were a minute before. Little by little, we advance with each turn. That’s how a drill works!\" - Simon (Tengen Topp Gurren Lagann)",
    "\"Never give up without even trying. Do what you can, no matter how small the effect it may have!\" - Onoki (Naruto)",
    "\"Don’t be upset because of what you can’t do. Do what you do best, live as carefree and optimistically as you can, because some people aren’t able to do that.\" - Keima Katsuragi (The World God Only Knows)",
    "\"You need to accept the fact that you’re not the best and have all the will to strive to be better than anyone you face.\" - Roronoa Zoro (One Piece)",
    "\"All we can do is live until the day we die. Control what we can… and fly free.\" - Deneil Young (Uchuu Kyoudai aka Space Brothers)",
    "\"When the world shoves you around, you just gotta stand up and shove back. It’s not like somebody’s gonna save you if you start babbling excuses.\" - Roronoa Zoro (One Piece)",
    "\"The moon does not mourn over the dead. What it does is shine a light on the truth.\" - Shinichi Kudo (Detective Conan)",
    "\"By looking at what’s blocking our way, with an open mind, a wall can be turned into a wide open door.\" - Shinichi Kudo (Detective Conan)",
    "\"When people make a mistake, it is nice to give them advice, but… if they don’t listen, just leave them alone. Otherwise you’ll do yourself a disservice by wasting your time and effort.\" - Ran Mouri (Detective Conan)",
    "\"There’s no such thing as fair or unfair in battle. There is only victory or in your case, defeat.\" - Vegeta (Dragon Ball Z)",
    "\"Even the mightiest warriors experience fears. What makes them a true warrior is the courage that they posses to overcome their fears.\" - Vegeta (Dragon Ball Z)",
    "\"Endure it. Don’t let go.\" - Armin Arlert (Attack on Titan)",
    "\"It's Not About Whether I Can. I Have To Do It.\" - Megumi Fushiguro (Jujutsu Kaisen)",
    "\"Searching for someone to blame is such a pain.\ - Satoru Gojo (Jujutsu Kaisen)",
    "\"I, Giorno Giovanna, have a dream!\" - Giorno Giovanna (Jojo's Bizarre Adventure)",
    "\"Impossible? We did a lot of impossible things on this journey. I’m tired of hearing that things are impossible or useless. Those words mean nothing to us.\" - Jotaro Kujo (Jojo's Bizarre Adventure)",
    "\"It can be said that humans live by destroying. In the midst of that, your power is kinder than anything else.\" - Jotaro Kujo to Josuke Higashikata (Jojo's Bizarre Adventure)",
    "\"The worst battle is between what you know, and what you feel.\" - Violet Evergarden (Violet Evergarden)",
    "\"Just so you know, I've always loved listening to you talk about your dreams, Denji. Here's a new contract for you. This time, you're getting my heart. In exchange, show me your dreams. That's all I ask of you.\" - Pochita (Chainsaw Man)",
    "\"Do not forget that you are certain to die someday, and as such, you have all the more reason to live now.\" - Decim (Death Parade)",
    "\"Everybody Matters To Somebody.\" - Chiyuki (Death Parade)",
    "\"Remember. You can feel it if you hold your hand against your chest. It belongs to no one. It's our pulse, yours and mine. This is what brings us to the truth. It's what proves that we are the very world itself. Follow your instincts. The answer is already there.\" - Ergo Proxy (Ergo Proxy)",
    "\"I'm not going to die. I'm going to find out if I'm really alive.\" - Re-l Mayer (Ergo Proxy)",
    "\"People are like dice, a certain Frenchman said that. You throw yourself in the direction of your own choosing. People are free because they can do that. Everyone's circumstances are different, but no matter how small the choice, at the very least, you can throw yourself. It's not chance or fate. It's the choice you made.\" - Yukio Washimine (Black Lagoon)",
    "\"If you cling to life, you live in fear of death. And that fear will cloud your judgment.\" - Revy Rebecca (Black Lagoon)",
    "\"Everything has a beginning and an end. Life is just a cycle of starts and stops. There are ends we don't desire, but they're inevitable, we have to face them. It's what being human is all about.\" - Jet Black (Cowboy Bebop)",
    "\"If you’re scared of falling over, you’ll just fall even more.\" - Ai Hoshino (Oshi no Ko)"
];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('animequotemotivation')
		.setDescription('Provides a motivational anime quote.'),
	async execute(interaction) {
        var randomAnswer = animeQuotes[Math.floor(Math.random() * animeQuotes.length)];
        
        var splitAnswer = randomAnswer.split(" - ");
        var randomQuote = splitAnswer[0]; 
        var randomAuthor = splitAnswer[1];
        
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`${randomQuote}`)
                    .setThumbnail('https://i.ytimg.com/vi/DAZ-p6ZNS40/maxresdefault.jpg')
                    .setFooter({
                        text: `${randomAuthor}`
                    })
            ]
        });
    },
};
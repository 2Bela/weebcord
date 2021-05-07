const { Client, Intents } = require("discord.js");
const intents = new Intents([
    Intents.NON_PRIVILEGED,
    "GUILD_MEMBERS",
]);
const config = require('./config.json')
const client = new Client({ ws: { intents } });
const wanakana = require('wanakana');

client.on('ready', () => {
    console.log('Ready');

});

client.on('message', msg => {
    if (msg.content === config.command)  {
        console.log('fetching');
        FetchMembers(msg);
    }
client.on('guildMemberAdd', member => {
    Translate(member)
})
});
async function Translate(member) {
    console.log(member.user.username)
    if(member.roles.cache.some(r => r.name === config.safeRole)) {
        console.log("Skipping "+member.user.username+" due to anti nick role")
    }   else {
        const text = member.user.username.toString();
        const jName = await translate(text, config.lang);
        console.log('translated ' + member.user.username + ' to ' + jName);
        member.setNickname(jName).catch(err => {
            if (err) {
                console.log(err);
            }
        })
        if (jName === member.user.username) {
            console.log('Setting alt name for ' + member);
            const kName = wanakana.toKatakana(member.user.username, {useObsoleteKana: true})
            member.setNickname(kName).catch(err => {
                if (err) {
                    console.log(err);
                }
            })
        } else {
            console.log('success');
        }
        return;
    }
    return;
}
async function FetchMembers(msg) {
    const Members = (await msg.guild.members.fetch()).array()
    console.log('fetched ' + Members);
    console.log(Members.length);
    for (let i = 0; i < Members.length; i++) {
        const Member = Members[i];
        console.log('Translating' + Member.user.username);
        Translate(Member);
    }
}


client.login(config.botToken);

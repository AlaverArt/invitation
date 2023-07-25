<template>
    <form ref="inviteForm" @submit.prevent="sendForm">
        <fieldset>
            <legend>Контактная информация</legend>
            <p><label for="name">ФИО</label><input id="input-age" name="name" type="text"></p>
            <p><label for="age">Возраст</label><input id="input-age" name="age" type="text"></p>
            <button type="submit">Отправить</button>
        </fieldset>
    </form>
</template>

<script>
export default {
    name: 'InviteForm',
    methods: {
        async sendForm() {
            const resp = await fetch('http://localhost:3000/form', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.$refs.inviteForm.name.value,
                    age: this.$refs.inviteForm.age.value,
                })
            });
            console.log('form sent', await resp.json());
        }
    },
};
</script>

<style lang="scss" scoped>
</style>

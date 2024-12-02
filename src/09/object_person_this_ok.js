const person = {
    name: 'Alice',
    greet: function() {
        console.log(`こんにちは、私は${this.name}です。`);
    }
}

person.greet();
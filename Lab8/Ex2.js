require("./products_data.js");

num_products = 5;

item_num = 0;

while(item_num < num_products) {
    item_num++;
    if((item_num >= 0.25*num_products) && (item_num <= 0.75*num_products)) {
        console.log(`Don’t ask for anything else!`);
        process.exit();
    }
    console.log(`${item_num}. ${eval('name' + item_num)}`);
    

}
console.log('That\'s all we have!')
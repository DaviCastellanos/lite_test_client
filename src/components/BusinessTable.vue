<template>
    <table class="table table-striped">
        <thead>
            <tr>
            <!-- loop through each value of the fields to get the table header -->
            <th  v-for="field in this.getFields()" :key='field'> 
                {{field}} <i class="bi bi-sort-alpha-down" aria-label='Sort Icon'></i>
            </th>
            </tr>
        </thead>
        <tbody>
            <!-- Loop through the list get the each student data -->
            <tr v-for="item in this.getItems()" :key='item'>
            <td v-for="field in this.getFields()" :key='field'>{{item[field]}}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  props: {
    businessArray: undefined
  },
  methods: {
    getFields() {
      return [
        'NIT', 'Name', 'More'
      ];
    },
    getItems() {
        console.log("Getting items ", this.businessArray)
      if (!this.businessArray) return;

      let items = [];

      if (this.businessArray != undefined && this.businessArray.length >= 1) {
        for (var i = 0; i < this.businessArray.length; i++) {
          items.push({
            NIT: this.businessArray[i].nit,
            Name: this.businessArray[i].name,
            More: "+",
          });
        }
      }
      return items;
    }
  }
};
</script>
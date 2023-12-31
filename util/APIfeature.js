class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter(){
      console.log(1);
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(el => delete queryObj[el]);
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
      console.log(this.query);
      return this;
    }
    
    search(searchFor) {
        if (this.queryString.search) {
            const regex = new RegExp(this.queryString.search);
            const $or = searchFor.map((element) => {
                return { [element]: { $regex: regex, $options: "i" } };
            });
            this.query = this.query.find({ $or });
        }
        return this;
    }

    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
  
      return this;
    }
  
    limit() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this;
    }
  
    page() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return { query: this, page, limit };
    }
  }
  module.exports = APIFeatures;
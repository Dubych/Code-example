  async getMetrc() {
    try {
      if (this.isLinkItemToSku) {
        await this.getMetrcItemList();
        this.foundSku = this.products.find(x => x.sku === this.sku);
      } else {
        const dateStart = this.displayFromDate && !this.isFirstRequest ? this.toModel(this.displayFromDate) : null;
        const dateEnd = this.displayToDate && !this.isFirstRequest ? this.toModel(this.displayToDate) : null;
        const resPackages = await this.warehouseServiceClient.getMetrcPackageList(
          this.licenses,
          this.sku,
          this.companyId,
          dateStart,
          dateEnd,
        );
        const packages = [];
        if (resPackages && resPackages.edges.length) {
          for (const edge of resPackages.edges) {
            packages.push(edge.node);
          }
          this.packages = JSON.parse(JSON.stringify(packages));
        }
  
        this.duplicatePackages = JSON.parse(JSON.stringify(this.packages));
        if (this.packages.length === 0 && !this.doNotShowItemsAgain && !this.foundSku) {
          await this.getMetrcItemList();
          this.foundSku = this.products.find((x: any) => x.sku === this.sku);
          if (!this.foundSku) {
            this.isPackageUid = false;
          }
        }
      }
      this.global.toggleLoader(false);
    } catch (err) {
      this.global.setError(err);
    }
  }

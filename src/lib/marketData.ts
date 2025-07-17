// Private helper methods
  private processJobData(rawData: any): any {
    return {
      totalJobs: rawData.data?.length || 0,
      averageSalary: this.calculateAverageSalary(rawData.data),
      topCompanies: this.extractTopCompanies(rawData.data),
      requiredSkills: this.extractRequiredSkills(rawData.data),
      locations: this.extractTopLocations(rawData.data),
      remotePercentage: this.calculateRemotePercentage(rawData.data)
    };
  }
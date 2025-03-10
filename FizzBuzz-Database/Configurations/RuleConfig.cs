using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FizzBuzz_Database.Configurations;

public class RuleConfig : IEntityTypeConfiguration<Rule>
{
    public void Configure(EntityTypeBuilder<Rule> builder)
    {
        builder.HasKey(r => r.Id);
        builder.Property(r => r.RuleName).IsRequired().HasMaxLength(255);
        builder.Property(r => r.Number).IsRequired();
    }
}